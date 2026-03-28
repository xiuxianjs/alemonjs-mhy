/**
 * Stoken 管理服务
 * 存储、获取、删除 stoken，以及从 login_ticket / game_token 获取 stoken
 */
import { getIoRedis } from '@alemonjs/db';
import md5 from 'md5';
import { mihoyoKeys } from '../keys';
import { addUserUid } from './account';
import { extractGameUids } from './cookie';
import { fetchGameRoles } from './mysApi';
import type { MihoyoGame } from './types';

// ─── 常量 ────────────────────────────────────────────

const STOKEN_EXPIRY_SECONDS = 86400 * 90; // 90 天
const MHY_WEB_API = 'https://api-takumi.mihoyo.com';
const MHY_PASS_API = 'https://passport-api.mihoyo.com';
const MHY_HK4_SDK = 'https://hk4e-sdk.mihoyo.com';
const MHY_APP_VERSION = '2.70.1';
const MHY_PASS_SALT = 'JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS';
const QR_APP_ID = 2;
const VALID_GAME_BIZ = ['hk4e_cn', 'hk4e_global', 'hkrpg_cn', 'hkrpg_global', 'nap_cn', 'nap_global'];

// ─── 存储类型 ────────────────────────────────────────

export interface StokenData {
  stuid: string;
  stoken: string;
  ltoken: string;
  mid?: string;
  uid: string;
  userId: string;
}

// ─── DS 签名 ────────────────────────────────────────

const generateDs2 = (q: string, b: string, salt: string): string => {
  const t = Math.floor(Date.now() / 1000);
  const r = Math.floor(Math.random() * 100000 + 100001);
  const c = md5(`salt=${salt}&t=${t}&r=${r}&b=${b}&q=${q}`);

  return `${t},${r},${c}`;
};

// ─── 通用 Fetch ─────────────────────────────────────

interface RawApiResponse {
  retcode: number;
  message: string;
  data?: any;
}

const fetchMhyApi = async (
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }
): Promise<RawApiResponse | null> => {
  try {
    const res = await fetch(url, {
      method: options.method ?? 'GET',
      headers: options.headers ?? {},
      body: options.body
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as RawApiResponse;
  } catch {
    return null;
  }
};

// ─── Stoken CRUD ────────────────────────────────────

export const getUserStoken = async (userId: string): Promise<StokenData | null> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.stokenByUser(userId);
  const raw = await redis.get(key);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as StokenData;
};

export const saveUserStoken = async (userId: string, data: StokenData): Promise<void> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.stokenByUser(userId);

  await redis.setex(key, STOKEN_EXPIRY_SECONDS, JSON.stringify(data));
};

export const deleteUserStoken = async (userId: string): Promise<boolean> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.stokenByUser(userId);
  const existed = await redis.exists(key);

  if (existed === 0) {
    return false;
  }

  await redis.del(key);

  return true;
};

// ─── 构建 stoken cookie ─────────────────────────────

export const buildStokenCookie = (data: StokenData): string => {
  if (data.mid) {
    return `stuid=${data.stuid};stoken=${data.stoken};mid=${data.mid};`;
  }

  return `stuid=${data.stuid};stoken=${data.stoken};ltoken=${data.ltoken};`;
};

// ─── 从 login_ticket 获取 stoken ────────────────────

export const fetchStokenByLoginTicket = async (loginTicket: string, loginUid: string): Promise<{ stoken: string; ltoken: string } | null> => {
  const base = `${MHY_WEB_API}/auth/api/getMultiTokenByLoginTicket`;
  const params = `login_ticket=${encodeURIComponent(loginTicket)}&token_types=3&uid=${encodeURIComponent(loginUid)}`;
  const url = `${base}?${params}`;

  const res = await fetchMhyApi(url, {
    headers: {
      'x-rpc-device_id': 'zxcvbnmasadfghjk123456',
      'Content-Type': 'application/json;charset=UTF-8',
      'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/${MHY_APP_VERSION}`,
      Referer: 'cors',
      'x-rpc-channel': 'appstore'
    }
  });

  if (!res?.data?.list || res.retcode !== 0) {
    return null;
  }

  const list = res.data.list as Array<{ name: string; token: string }>;
  const stokenEntry = list.find(i => i.name === 'stoken');
  const ltokenEntry = list.find(i => i.name === 'ltoken');

  if (!stokenEntry?.token || !ltokenEntry?.token) {
    return null;
  }

  return { stoken: stokenEntry.token, ltoken: ltokenEntry.token };
};

// ─── 通过 stoken 获取 cookie_token ──────────────────

export const fetchCookieTokenByStoken = async (stokenCookie: string): Promise<string | null> => {
  const url = `${MHY_WEB_API}/auth/api/getCookieAccountInfoBySToken?game_biz=hk4e_cn&${stokenCookie.replace(/;/g, '&')}`;

  const res = await fetchMhyApi(url, {
    headers: {
      Cookie: stokenCookie,
      'User-Agent': 'okhttp/4.8.0'
    }
  });

  return res?.data?.cookie_token ?? null;
};

// ─── 通过 stoken 获取 ltoken ────────────────────────

export const fetchLtokenByStoken = async (stokenCookie: string): Promise<string | null> => {
  const url = `${MHY_PASS_API}/account/auth/api/getLTokenBySToken?${stokenCookie.replace(/;/g, '&')}`;

  const res = await fetchMhyApi(url, {
    headers: {
      'User-Agent': 'okhttp/4.8.0'
    }
  });

  return res?.data?.ltoken ?? null;
};

// ─── 通过 stoken 获取绑定的游戏 UID ─────────────────

export const fetchGameUidsByStoken = async (
  stokenCookie: string
): Promise<{
  uids: Record<MihoyoGame, string[]>;
  roles: Array<{ game_uid: string; game_biz: string; region: string; region_name: string; nickname: string }>;
} | null> => {
  // 通过 stoken 获取 cookie_token 再获取角色
  const cookieToken = await fetchCookieTokenByStoken(stokenCookie);

  if (!cookieToken) {
    return null;
  }

  // 从 stokenCookie 中提取 stuid
  const stuidMatch = stokenCookie.match(/stuid=([^;]+)/);
  const stuid = stuidMatch?.[1] ?? '';
  const fullCk = `ltoken=${stokenCookie.match(/ltoken=([^;]+)/)?.[1] ?? ''};ltuid=${stuid};cookie_token=${cookieToken};account_id=${stuid};`;

  const roleResult = await fetchGameRoles(fullCk);

  if (!roleResult.success) {
    return null;
  }

  const filtered = roleResult.roles.filter(r => VALID_GAME_BIZ.includes(r.game_biz));
  const uids = extractGameUids(filtered);

  return {
    uids,
    roles: filtered.map(r => ({
      game_uid: r.game_uid,
      game_biz: r.game_biz,
      region: r.region,
      region_name: r.nickname,
      nickname: r.nickname
    }))
  };
};

// ─── 绑定 stoken（从原始 stoken 字符串） ────────────

export interface BindStokenResult {
  success: boolean;
  message: string;
  uids?: Record<MihoyoGame, string[]>;
}

const parseCookieMap = (raw: string): Map<string, string> => {
  const map = new Map<string, string>();

  raw
    .replace(/\s/g, '')
    .split(';')
    .forEach(seg => {
      const eq = seg.indexOf('=');

      if (eq > 0) {
        map.set(seg.slice(0, eq), seg.slice(eq + 1));
      }
    });

  return map;
};

export const bindStoken = async (userId: string, rawStoken: string): Promise<BindStokenResult> => {
  const ckMap = parseCookieMap(rawStoken);
  const stoken = ckMap.get('stoken');
  const stuid = ckMap.get('stuid') ?? ckMap.get('uid');
  const ltoken = ckMap.get('ltoken') ?? '';
  const mid = ckMap.get('mid');

  if (!stoken || !stuid) {
    return { success: false, message: 'stoken格式不正确，需包含 stoken 和 stuid 字段' };
  }

  // 构建 stoken cookie 用于后续请求
  let stCookie = `stuid=${stuid};stoken=${stoken};`;

  if (ltoken) {
    stCookie += `ltoken=${ltoken};`;
  }

  if (mid) {
    stCookie += `mid=${mid};`;
  }

  // 验证 stoken 有效性并获取绑定的游戏 UID
  const result = await fetchGameUidsByStoken(stCookie);

  if (!result) {
    // 尝试先获取 ltoken
    const fetchedLtoken = ltoken || (await fetchLtokenByStoken(stCookie));

    if (!fetchedLtoken) {
      return { success: false, message: 'stoken已失效或格式不正确，请重新获取' };
    }

    stCookie = `stuid=${stuid};stoken=${stoken};ltoken=${fetchedLtoken};`;

    if (mid) {
      stCookie += `mid=${mid};`;
    }

    const retryResult = await fetchGameUidsByStoken(stCookie);

    if (!retryResult) {
      return { success: false, message: 'stoken验证失败，请重新获取' };
    }

    // 取第一个 UID 作为主 UID
    const mainUid = retryResult.roles[0]?.game_uid ?? '';

    const data: StokenData = { stuid, stoken, ltoken: fetchedLtoken, mid, uid: mainUid, userId };

    await saveUserStoken(userId, data);

    // 同步 UID 到绑定列表
    for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
      for (const uid of retryResult.uids[game]) {
        await addUserUid(userId, game, uid);
      }
    }

    logger.mark(`[stoken绑定] 用户 ${userId} 绑定成功 [stuid:${stuid}]`);

    return { success: true, message: 'stoken绑定成功', uids: retryResult.uids };
  }

  const mainUid = result.roles[0]?.game_uid ?? '';

  const finalLtoken = ltoken ?? (await fetchLtokenByStoken(stCookie)) ?? '';
  const data: StokenData = { stuid, stoken, ltoken: finalLtoken, mid, uid: mainUid, userId };

  await saveUserStoken(userId, data);

  for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
    for (const uid of result.uids[game]) {
      await addUserUid(userId, game, uid);
    }
  }

  logger.mark(`[stoken绑定] 用户 ${userId} 绑定成功 [stuid:${stuid}]`);

  return { success: true, message: 'stoken绑定成功', uids: result.uids };
};

// ─── 二维码登录 ─────────────────────────────────────

export const qrCodeFetch = async (device: string): Promise<{ url: string; ticket: string } | null> => {
  const url = `${MHY_HK4_SDK}/hk4e_cn/combo/panda/qrcode/fetch`;
  const body = JSON.stringify({ app_id: QR_APP_ID, device });

  const res = await fetchMhyApi(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  if (res?.retcode !== 0 || !res.data?.url) {
    return null;
  }

  const ticket = (res.data.url as string).split('ticket=')[1] ?? '';

  return { url: res.data.url, ticket };
};

export type QrCodeStatus = 'Init' | 'Scanned' | 'Confirmed' | 'Expired';

export const qrCodeQuery = async (device: string, ticket: string): Promise<{ stat: QrCodeStatus; raw?: { uid: string; token: string } } | null> => {
  const url = `${MHY_HK4_SDK}/hk4e_cn/combo/panda/qrcode/query`;
  const body = JSON.stringify({ app_id: QR_APP_ID, device, ticket });

  const res = await fetchMhyApi(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  if (!res?.data) {
    return null;
  }

  const stat = res.data.stat as QrCodeStatus;
  let raw: { uid: string; token: string } | undefined;

  if (stat === 'Confirmed' && res.data.payload?.raw) {
    raw = JSON.parse(res.data.payload.raw as string) as { uid: string; token: string };
  }

  return { stat, raw };
};

// ─── Game Token → Stoken + Cookie ───────────────────

export const fetchTokenByGameToken = async (
  gameUid: string,
  gameToken: string
): Promise<{ stoken: string; stuid: string; mid: string; ltoken: string; cookieToken: string } | null> => {
  // 1. getTokenByGameToken → stoken
  const tokenUrl = `${MHY_PASS_API}/account/ma-cn-session/app/getTokenByGameToken`;
  const tokenBody = JSON.stringify({ account_id: Number(gameUid), game_token: gameToken });
  const ds = generateDs2('', tokenBody, MHY_PASS_SALT);

  const tokenRes = await fetchMhyApi(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rpc-app_id': 'bll8iq97cem8',
      'x-rpc-client_type': '2',
      DS: ds,
      'User-Agent': 'okhttp/4.8.0'
    },
    body: tokenBody
  });

  if (tokenRes?.retcode !== 0 || !tokenRes.data) {
    return null;
  }

  const stoken = tokenRes.data.token?.token as string;
  const stuid = String(tokenRes.data.user_info?.aid ?? gameUid);
  const mid = (tokenRes.data.user_info?.mid as string) ?? '';

  // 2. getCookieAccountInfoByGameToken → cookie_token
  const ckUrl = `${MHY_WEB_API}/auth/api/getCookieAccountInfoByGameToken?account_id=${encodeURIComponent(gameUid)}&game_token=${encodeURIComponent(gameToken)}`;

  const ckRes = await fetchMhyApi(ckUrl, {
    headers: { 'User-Agent': 'okhttp/4.8.0' }
  });

  const cookieToken = (ckRes?.data?.cookie_token as string) ?? '';

  // 3. 获取 ltoken
  const stCookie = `stuid=${stuid};stoken=${stoken};mid=${mid};`;
  const ltoken = (await fetchLtokenByStoken(stCookie)) ?? '';

  return { stoken, stuid, mid, ltoken, cookieToken };
};

// ─── QR 登录会话 ───────────────────────────────────

const QR_SESSION_SECONDS = 300; // 5 分钟

export interface QrSession {
  device: string;
  ticket: string;
  qrDataUrl: string;
}

export const getQrSession = async (userId: string): Promise<QrSession | null> => {
  const redis = getIoRedis();
  const raw = await redis.get(mihoyoKeys.qrLoginLock(userId));

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as QrSession;
};

export const setQrSession = async (userId: string, session: QrSession): Promise<void> => {
  const redis = getIoRedis();

  await redis.setex(mihoyoKeys.qrLoginLock(userId), QR_SESSION_SECONDS, JSON.stringify(session));
};

export const clearQrSession = async (userId: string): Promise<void> => {
  const redis = getIoRedis();

  await redis.del(mihoyoKeys.qrLoginLock(userId));
};
