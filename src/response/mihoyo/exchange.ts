/**
 * 兑换码查询
 * 命令: #兑换码 / #原神兑换码 / #星铁兑换码
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

const GAME_GID: Record<MihoyoGame, number> = {
  gs: 2,
  sr: 6,
  zzz: 8
};

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

// 从米游社直播帖子中提取兑换码
const MIYOLIVE_ACT_IDS: Record<MihoyoGame, number> = {
  gs: 75276539,
  sr: 80823548,
  zzz: 152039148
};

const BBS_API = 'https://bbs-api.miyoushe.com';

const fetchNewsListForCodes = async (game: MihoyoGame): Promise<string[]> => {
  const headers = {
    Referer: 'https://www.miyoushe.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    // 搜索直播帖子获取 act_id
    const listUrl = `${BBS_API}/painter/wapi/getNewsList?gids=${GAME_GID[game]}&page_size=20&type=1`;
    const listRes = await fetch(listUrl, { headers });

    if (!listRes.ok) {
      return [];
    }

    const listJson = (await listRes.json()) as {
      data?: { list?: Array<{ post: { post_id: string; subject: string; content: string } }> };
    };

    const posts = listJson.data?.list ?? [];

    // 找包含"兑换码"或"前瞻"的帖子
    const livePost = posts.find(p => p.post.subject.includes('前瞻') || p.post.subject.includes('直播') || p.post.content.includes('兑换码'));

    if (!livePost) {
      return [];
    }

    // 尝试从帖子内容提取兑换码 (大写字母+数字 8-16位)
    const codePattern = /\b[A-Z0-9]{8,16}\b/g;
    const content = livePost.post.content;
    const matches = content.match(codePattern) ?? [];

    // 过滤常见非兑换码字符串
    return matches.filter(code => /[A-Z]/.test(code) && /[0-9]/.test(code));
  } catch {
    return [];
  }
};

// 尝试通过 miyolive API 获取兑换码
const fetchMiyoliveCodes = async (game: MihoyoGame): Promise<string[]> => {
  try {
    const actId = MIYOLIVE_ACT_IDS[game];
    const url = 'https://api-takumi.mihoyo.com/event/miyolive/index';
    const headers = {
      'x-rpc-act_id': String(actId),
      'User-Agent': 'Mozilla/5.0',
      Referer: 'https://webstatic.mihoyo.com/'
    };

    const res = await fetch(url, { headers });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as {
      retcode: number;
      data?: { live?: { code_list?: Array<{ code: string; title: string }> } };
    };

    if (json.retcode !== 0) {
      return [];
    }

    return (json.data?.live?.code_list ?? []).map(c => c.code).filter(Boolean);
  } catch {
    return [];
  }
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

  const md = Format.createMarkdown();

  // 先尝试 miyolive API
  let codes = await fetchMiyoliveCodes(game);

  // 如果没有再尝试从帖子提取
  if (codes.length === 0) {
    codes = await fetchNewsListForCodes(game);
  }

  if (codes.length === 0) {
    md.addText(`【${GAME_NAMES[game]}·兑换码】\n\n暂无可用的兑换码\n可能当前没有活动直播或兑换码已过期`);
  } else {
    const lines: string[] = [
      `【${GAME_NAMES[game]}·兑换码】`,
      '',
      ...codes.map((code, i) => `${i + 1}. ${code}`),
      '',
      '兑换地址:',
      game === 'gs' ? 'https://genshin.hoyoverse.com/gift' : '',
      game === 'sr' ? 'https://hsr.hoyoverse.com/gift' : '',
      game === 'zzz' ? 'https://zenless.hoyoverse.com/redemption' : ''
    ].filter(Boolean);

    md.addText(lines.join('\n'));
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
