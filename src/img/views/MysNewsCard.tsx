import React from 'react';
import HTML from './HTML.js';

// ─── 类型定义 ────────────────────────────────────────

export interface NewsItem {
  subject: string;
  date: string;
}

export interface NewsDetailData {
  mode: 'detail';
  game: string;
  typeName: string;
  subject: string;
  date: string;
  content: string;
}

export interface NewsListData {
  mode: 'list';
  game: string;
  typeName: string;
  items: NewsItem[];
}

export type MysNewsData = NewsDetailData | NewsListData;

export interface MysNewsCardProps {
  data: MysNewsData;
}

// ─── 样式 ────────────────────────────────────────────

const GAME_COLORS: Record<string, string> = {
  原神: '#8b6d3f',
  星穹铁道: '#5c6bc0',
  绝区零: '#e65100'
};

const styles = {
  card: {
    padding: '24px',
    background: 'linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)',
    fontFamily: '"tttgbnumber", system-ui, sans-serif',
    fontSize: '14px',
    color: '#1e1f20'
  },
  header: {
    background: 'linear-gradient(135deg, #e8d5b0, #d3bc8e)',
    borderRadius: '14px 14px 0 0',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  body: {
    background: '#fff',
    borderRadius: '0 0 14px 14px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  listRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '8px 0',
    borderBottom: '1px solid #f0ede8',
    gap: '12px'
  },
  index: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#c6923a',
    flexShrink: 0,
    width: '20px'
  },
  subject: {
    fontSize: '13px',
    color: '#1e1f20',
    flex: 1,
    lineHeight: '1.4'
  },
  date: {
    fontSize: '11px',
    color: '#9e8e7e',
    flexShrink: 0
  },
  detailTitle: {
    fontSize: '15px',
    fontWeight: 'bold' as const,
    color: '#4a3c2a',
    lineHeight: '1.5',
    paddingBottom: '8px',
    borderBottom: '1px solid #f0ede8',
    marginBottom: '10px'
  },
  detailDate: {
    fontSize: '12px',
    color: '#9e8e7e',
    marginBottom: '12px'
  },
  detailContent: {
    fontSize: '13px',
    color: '#3a3a3a',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-all' as const
  },
  hint: {
    fontSize: '12px',
    color: '#9e8e7e',
    textAlign: 'center' as const,
    padding: '8px 0 0'
  },
  noData: {
    textAlign: 'center' as const,
    padding: '20px 0',
    color: '#9e8e7e',
    fontSize: '14px'
  }
};

// ─── 列表模式 ────────────────────────────────────────

function ListContent({ data }: { data: NewsListData }) {
  if (data.items.length === 0) {
    return <div style={styles.noData}>暂无{data.typeName}数据</div>;
  }

  return (
    <>
      {data.items.map((item, i) => (
        <div key={i} style={styles.listRow}>
          <span style={styles.index}>{i + 1}</span>
          <span style={styles.subject}>{item.subject}</span>
          <span style={styles.date}>{item.date}</span>
        </div>
      ))}
      <div style={styles.hint}>发送 #{data.typeName}+序号 查看详情</div>
    </>
  );
}

// ─── 详情模式 ────────────────────────────────────────

function DetailContent({ data }: { data: NewsDetailData }) {
  return (
    <>
      <div style={styles.detailTitle}>{data.subject}</div>
      <div style={styles.detailDate}>发布时间: {data.date}</div>
      <div style={styles.detailContent}>{data.content}</div>
    </>
  );
}

// ─── 主组件 ──────────────────────────────────────────

export default function MysNewsCard({ data }: MysNewsCardProps) {
  const accent = GAME_COLORS[data.game] ?? '#8b6d3f';
  const title = `${data.game} · ${data.typeName}${data.mode === 'list' ? '列表' : ''}`;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <HTML>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📰</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: accent }}>{title}</span>
          </div>
        </div>

        <div style={styles.body}>
          {data.mode === 'list' && <ListContent data={data} />}
          {data.mode === 'detail' && <DetailContent data={data} />}
        </div>

        <div style={{ textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' }}>{dateStr}</div>
      </div>
    </HTML>
  );
}
