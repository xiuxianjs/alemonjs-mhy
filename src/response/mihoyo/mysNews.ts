/**
 * 米游社公告 / 资讯
 * 命令: #公告 / #资讯 / #活动 / #原神公告 / #星铁资讯
 */
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const resolveGame = (text: string): MihoyoGame => {
  if (text.includes('星铁')) {
    return 'sr';
  }

  if (text.includes('绝区零')) {
    return 'zzz';
  }

  return 'gs';
};

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const GAME_GID: Record<MihoyoGame, number> = {
  gs: 2,
  sr: 6,
  zzz: 8
};

interface NewsPost {
  post: {
    post_id: string;
    subject: string;
    content: string;
    created_at: number;
  };
}

interface NewsListResponse {
  retcode: number;
  data?: {
    list?: NewsPost[];
  };
}

const fetchNewsList = async (gid: number, type: number, pageSize: number): Promise<NewsPost[]> => {
  const url = `https://bbs-api-static.miyoushe.com/painter/wapi/getNewsList?gids=${gid}&page_size=${pageSize}&type=${type}`;
  const headers = {
    Referer: 'https://www.miyoushe.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    const res = await fetch(url, { headers });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as NewsListResponse;

    if (json.retcode !== 0) {
      return [];
    }

    return json.data?.list ?? [];
  } catch {
    return [];
  }
};

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp * 1000);

  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ─── 入口 ────────────────────────────────────────────

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const text = e.MessageText ?? '';
  const game = resolveGame(text);

  let type = 1;
  let typeName = '公告';

  if (text.includes('资讯')) {
    type = 3;
    typeName = '资讯';
  } else if (text.includes('活动')) {
    type = 2;
    typeName = '活动';
  }

  // 解析页码
  const pageMatch = text.match(/\d+$/);
  const requestedPage = pageMatch ? Number(pageMatch[0]) : 0;

  const gid = GAME_GID[game];
  const posts = await fetchNewsList(gid, type, 10);

  const md = Format.createMarkdown();

  if (posts.length === 0) {
    md.addText(`【${GAME_NAMES[game]}·${typeName}】\n\n暂无${typeName}数据`);
  } else if (requestedPage > 0 && requestedPage <= posts.length) {
    // 查看指定公告详情（纯文本摘要）
    const post = posts[requestedPage - 1];
    let content = post.post.content;

    // 移除 HTML 标签
    content = content.replace(/<[^>]+>/g, '');
    // 移除多余空白
    content = content.replace(/\s+/g, ' ').trim();
    // 截断到合理长度
    const maxLen = 500;

    if (content.length > maxLen) {
      content = content.slice(0, maxLen) + '...';
    }

    md.addText([`【${GAME_NAMES[game]}·${typeName}】`, '', post.post.subject, `发布时间: ${formatDate(post.post.created_at)}`, '', content].join('\n'));
  } else {
    // 列表模式
    const lines: string[] = [`【${GAME_NAMES[game]}·${typeName}列表】`, ''];

    posts.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.post.subject}  (${formatDate(p.post.created_at)})`);
    });

    lines.push('', `发送 #${typeName}+序号 查看详情，如 #${typeName}1`);
    md.addText(lines.join('\n'));
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
