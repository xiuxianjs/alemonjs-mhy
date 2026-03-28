import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Document } from '@langchain/core/documents';
import { OllamaEmbeddings } from '@langchain/ollama';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import 'dotenv/config';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
const DOCS_DIR = process.env.DOCS_DIR || './docs';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
const CHUNK_SIZE = Number(process.env.CHUNK_SIZE || 1000);
const CHUNK_OVERLAP = Number(process.env.CHUNK_OVERLAP || 150);
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'xiuxian_game_docs';
const TABLE_NAME = process.env.PGVECTOR_TABLE_NAME || 'langchain_pg_embedding';
const COLLECTION_TABLE_NAME = process.env.PGVECTOR_COLLECTION_TABLE_NAME || 'langchain_pg_collection';

if (!DATABASE_URL) {
  throw new Error('缺少 DATABASE_URL');
}

function parseArgs(argv) {
  const args = {
    clear: false,
    path: null
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--clear') {
      args.clear = true;
      continue;
    }

    if (arg === '--path') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('`--path` 需要指定文件路径、目录或 glob 模式');
      }
      args.path = value;
      i++;
    }
  }

  return args;
}

function normalizeSourcePath(filePath) {
  return path.resolve(filePath);
}

function readFileContent(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, 'utf-8');

  if (ext === '.json') {
    try {
      const parsed = JSON.parse(raw);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return raw;
    }
  }

  return raw;
}

async function resolveTargetFiles(targetPath) {
  if (!targetPath) {
    const pattern = path.join(DOCS_DIR, '**/*.{md,txt,json,sql}');
    return glob(pattern, { nodir: true });
  }

  const absPath = path.resolve(targetPath);

  if (fs.existsSync(absPath)) {
    const stat = fs.statSync(absPath);

    if (stat.isDirectory()) {
      const pattern = path.join(absPath, '**/*.{md,txt,json,sql}');
      return glob(pattern, { nodir: true });
    }

    if (stat.isFile()) {
      return [absPath];
    }
  }

  return glob(targetPath, { nodir: true });
}

async function loadDocs(targetPath) {
  const files = await resolveTargetFiles(targetPath);

  console.log(`发现文件数: ${files.length}`);

  const docs = [];

  for (const filePath of files) {
    const content = readFileContent(filePath).trim();

    if (!content) {
      console.log(`跳过空文件: ${filePath}`);
      continue;
    }

    docs.push({
      filePath,
      doc: new Document({
        pageContent: content,
        metadata: {
          source: normalizeSourcePath(filePath),
          fileName: path.basename(filePath),
          ext: path.extname(filePath).toLowerCase(),
          relativePath: path.relative(process.cwd(), filePath)
        }
      })
    });
  }

  return docs;
}

function enrichSplitDocs(splitDocs) {
  const grouped = new Map();

  for (const doc of splitDocs) {
    const source = doc.metadata?.source || 'unknown';
    if (!grouped.has(source)) {
      grouped.set(source, []);
    }
    grouped.get(source).push(doc);
  }

  const finalDocs = [];

  for (const docs of grouped.values()) {
    docs.forEach((doc, index) => {
      doc.metadata = {
        ...doc.metadata,
        chunkIndex: index,
        chunkNumber: index + 1,
        totalChunks: docs.length
      };
      finalDocs.push(doc);
    });
  }

  return finalDocs;
}

async function clearCollection(pool) {
  console.log(`准备清空 collection: ${COLLECTION_NAME}`);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const collectionRes = await client.query(`SELECT uuid, name FROM ${COLLECTION_TABLE_NAME} WHERE name = $1`, [COLLECTION_NAME]);

    if (collectionRes.rowCount === 0) {
      console.log(`未找到 collection: ${COLLECTION_NAME}，无需清理。`);
      await client.query('COMMIT');
      return;
    }

    const collectionId = collectionRes.rows[0].uuid;

    const deleteEmbeddingRes = await client.query(`DELETE FROM ${TABLE_NAME} WHERE collection_id = $1`, [collectionId]);

    await client.query(`DELETE FROM ${COLLECTION_TABLE_NAME} WHERE uuid = $1`, [collectionId]);

    await client.query('COMMIT');

    console.log(`已清空 collection: ${COLLECTION_NAME}，删除向量 ${deleteEmbeddingRes.rowCount} 条。`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log('导入配置:');
  console.log(`- collectionName: ${COLLECTION_NAME}`);
  console.log(`- docsDir: ${DOCS_DIR}`);
  console.log(`- chunkSize: ${CHUNK_SIZE}`);
  console.log(`- chunkOverlap: ${CHUNK_OVERLAP}`);
  console.log(`- ollamaBaseUrl: ${OLLAMA_BASE_URL}`);
  console.log(`- ollamaEmbedModel: ${OLLAMA_EMBED_MODEL}`);
  console.log(`- clear: ${args.clear}`);
  console.log(`- path: ${args.path || '(默认扫描 DOCS_DIR)'}`);

  const pool = new Pool({
    connectionString: DATABASE_URL
  });

  try {
    if (args.clear) {
      await clearCollection(pool);
    }

    const rawDocsWithPath = await loadDocs(args.path);
    const rawDocs = rawDocsWithPath.map(item => item.doc);

    if (rawDocs.length === 0) {
      console.log('没有可导入的文档。');
      return;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP
    });

    const splitDocs = await splitter.splitDocuments(rawDocs);
    const enrichedDocs = enrichSplitDocs(splitDocs);

    console.log(`切块后文档数: ${enrichedDocs.length}`);

    const embeddings = new OllamaEmbeddings({
      baseUrl: OLLAMA_BASE_URL,
      model: OLLAMA_EMBED_MODEL
    });

    const vectorStore = await PGVectorStore.initialize(embeddings, {
      postgresConnectionOptions: {
        connectionString: DATABASE_URL
      },
      tableName: TABLE_NAME,
      collectionTableName: COLLECTION_TABLE_NAME,
      collectionName: COLLECTION_NAME,
      columns: {
        idColumnName: 'id',
        vectorColumnName: 'embedding',
        contentColumnName: 'document',
        metadataColumnName: 'metadata'
      }
    });

    console.log('开始写入 pgvector ...');

    await vectorStore.addDocuments(enrichedDocs);

    console.log('写入完成。');
    console.log(`本次写入 chunks: ${enrichedDocs.length}`);
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('执行失败:', err);
  process.exit(1);
});
