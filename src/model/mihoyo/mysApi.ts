/**
 * 米游社 API HTTP 客户端
 * 包含 DS 签名、device_fp、请求头构建、缓存
 */
import { getIoRedis } from '@alemonjs/db';
import { mihoyoConstants } from '@src/constants/mihoyo';
import md5 from 'md5';
import { mihoyoKeys } from '../keys';
import { buildMihoyoApiUrl } from './apiMap';
import { resolveMihoyoRegion } from './region';
import type { MihoyoGame, MihoyoRegionType } from './types';

// ─── 常量 ────────────────────────────────────────────

const CN_SALT = 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs';
const OS_SALT = 'okr4obncj8bw5a65hbnn5oo6ixjc3l9w';

const CN_APP_VERSION = '2.40.1';
const OS_APP_VERSION = '2.55.0';

const CN_CLIENT_TYPE = '5';
const OS_CLIENT_TYPE = '2';

const DS_RANDOM_MIN = 100000;
const DS_RANDOM_MAX = 999999;
const DS_RANDOM_RANGE = DS_RANDOM_MAX - DS_RANDOM_MIN + 1;

const HEX_CHARS = '0123456789abcdef';
const SEED_LENGTH = 16;
const DEVICE_ID_HASH_LENGTH = 5;

const MS_PER_SECOND = 1000;

const GAME_ROLE_URL_CN = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie';
const GAME_ROLE_URL_OS = 'https://sg-public-api.hoyolab.com/binding/api/getUserGameRolesByCookie';

const USER_FULL_INFO_URL = 'https://bbs-api.mihoyo.com/user/wapi/getUserFullInfo?gids=2';

const VALID_GAME_BIZ = ['hk4e_cn', 'hkrpg_cn', 'nap_cn', 'nap_global', 'hk4e_global', 'hkrpg_global'];

// ─── DS 签名 ────────────────────────────────────────

const generateDs = (query: string, body: string, regionType: MihoyoRegionType): string => {
  const salt = regionType === 'cn' ? CN_SALT : OS_SALT;
  const t = Math.round(Date.now() / MS_PER_SECOND);
  const r = Math.floor(Math.random() * DS_RANDOM_RANGE + DS_RANDOM_MIN);
  const hash = md5(`salt=${salt}&t=${t}&r=${r}&b=${body}&q=${query}`);

  return `${t},${r},${hash}`;
};

// ─── 设备相关 ────────────────────────────────────────

const generateSeed = (): string => {
  let result = '';

  for (let i = 0; i < SEED_LENGTH; i++) {
    result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }

  return result;
};

const generateDeviceId = (uid: string): string => {
  return `Yz-${md5(uid).substring(0, DEVICE_ID_HASH_LENGTH)}`;
};

// ─── 请求头构建 ──────────────────────────────────────

interface MihoyoHeaders {
  'x-rpc-app_version': string;
  'x-rpc-client_type': string;
  'User-Agent': string;
  Referer: string;
  DS: string;
  Cookie?: string;
  'x-rpc-device_fp'?: string;
  [key: string]: string | undefined;
}

const buildHeaders = (query: string, body: string, uid: string, regionType: MihoyoRegionType, deviceFp?: string): MihoyoHeaders => {
  const isCn = regionType === 'cn';
  const deviceId = generateDeviceId(uid);

  const headers: MihoyoHeaders = {
    'x-rpc-app_version': isCn ? CN_APP_VERSION : OS_APP_VERSION,
    'x-rpc-client_type': isCn ? CN_CLIENT_TYPE : OS_CLIENT_TYPE,
    'User-Agent': isCn
      ? `Mozilla/5.0 (Linux; Android 12; ${deviceId}) AppleWebKit/537.36 (KHTML, like Gecko) ` +
        `Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/${CN_APP_VERSION}`
      : 'Mozilla/5.0 (Linux; Android 11; J9110 Build/55.2.A.4.332; wv) AppleWebKit/537.36 ' +
        `(KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 miHoYoBBSOversea/${OS_APP_VERSION}`,
    Referer: isCn ? 'https://webstatic.mihoyo.com/' : 'https://act.hoyolab.com/',
    DS: generateDs(query, body, regionType)
  };

  if (deviceFp) {
    headers['x-rpc-device_fp'] = deviceFp;
  }

  return headers;
};

// ─── device_fp 获取 ──────────────────────────────────

/** 获取设备指纹（供后续阶段使用） */
export const fetchDeviceFp = async (uid: string, cookie: string, regionType: MihoyoRegionType): Promise<string | null> => {
  const seedId = generateSeed();
  const deviceId = generateDeviceId(uid);
  const urlMap = buildMihoyoApiUrl({
    api: 'getFp',
    game: 'gs',
    uid,
    query: { seed_id: seedId, device_id: deviceId }
  });

  if (!urlMap) {
    return null;
  }

  const headers = buildHeaders('', '', uid, regionType);

  headers['Cookie'] = cookie;

  try {
    const res = await fetch(urlMap.url, {
      method: urlMap.method.toLowerCase(),
      headers: headers as Record<string, string>
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as { data?: { device_fp?: string } };

    return json.data?.device_fp ?? null;
  } catch {
    return null;
  }
};

// ─── 缓存 Key ────────────────────────────────────────

const buildCacheKey = (uid: string, api: string, game: MihoyoGame): string => {
  return mihoyoKeys.queryCache(game, uid, api);
};

// ─── 核心查询方法 ────────────────────────────────────

export interface MysApiResponse {
  retcode: number;
  message: string;
  data: any;
  api?: string;
}

/**
 * 向米游社发起一次 API 请求
 */
export const mysApiFetch = async (params: {
  uid: string;
  cookie: string;
  api: string;
  game: MihoyoGame;
  query?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
  cached?: boolean;
}): Promise<MysApiResponse | null> => {
  const { uid, cookie, api, game, query, body, cached } = params;
  const redis = getIoRedis();
  const region = resolveMihoyoRegion(uid, game);

  // 检查缓存
  const cacheKey = buildCacheKey(uid, api, game);
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData) as MysApiResponse;
  }

  // 构建 URL
  const urlResult = buildMihoyoApiUrl({ api, game, uid, query });

  if (!urlResult) {
    return null;
  }

  // 分离 query string 用于 DS 签名
  const urlObj = new URL(urlResult.url);
  const queryString = urlObj.search.startsWith('?') ? urlObj.search.slice(1) : urlObj.search;
  const bodyString = body ? JSON.stringify(body) : '';

  // 构建 headers
  const headers = buildHeaders(queryString, bodyString, uid, region.type);

  headers['Cookie'] = cookie;

  // 请求参数
  const fetchOptions: RequestInit = {
    method: urlResult.method.toLowerCase(),
    headers: headers as Record<string, string>
  };

  if (body && urlResult.method === 'POST') {
    fetchOptions.body = bodyString;
  }

  const start = Date.now();

  try {
    const response = await fetch(urlResult.url, fetchOptions);

    if (!response.ok) {
      logger.error(`[米游社接口][${api}][${uid}] ${response.status} ${response.statusText}`);

      return null;
    }

    logger.mark(`[米游社接口][${api}][${uid}] ${Date.now() - start}ms`);

    const res = (await response.json()) as MysApiResponse;

    if (!res) {
      logger.mark('[米游社接口] 没有返回数据');

      return null;
    }

    res.api = api;

    // 写入缓存
    if (cached && res.retcode === 0) {
      await redis.setex(cacheKey, mihoyoConstants.cacheSeconds, JSON.stringify(res));
    }

    return res;
  } catch (error) {
    logger.error(`[米游社接口][${api}][${uid}] 请求异常: ${String(error)}`);

    return null;
  }
};

// ─── Cookie 验证 ────────────────────────────────────

export interface GameRoleInfo {
  game_uid: string;
  game_biz: string;
  nickname: string;
  region: string;
  level: number;
}

/**
 * 使用 cookie 获取绑定的游戏角色列表
 */
export const fetchGameRoles = async (
  cookie: string
): Promise<{
  success: boolean;
  roles: GameRoleInfo[];
  message: string;
}> => {
  // 先尝试国服，再尝试国际服
  for (const url of [GAME_ROLE_URL_CN, GAME_ROLE_URL_OS]) {
    try {
      const res = await fetch(url, {
        method: 'get',
        headers: { Cookie: cookie }
      });

      if (!res.ok) {
        continue;
      }

      const json = (await res.json()) as { retcode: number; message: string; data?: { list?: GameRoleInfo[] } };

      if (json.retcode === 0) {
        const playerList = (json.data?.list ?? []).filter(v => VALID_GAME_BIZ.includes(v.game_biz));

        return {
          success: true,
          roles: playerList,
          message: 'ok'
        };
      }

      if (json.retcode === -100) {
        return {
          success: false,
          roles: [],
          message: '该CK已失效，请重新登录获取'
        };
      }
    } catch {
      continue;
    }
  }

  return {
    success: false,
    roles: [],
    message: '无法验证Cookie，请检查网络或重试'
  };
};

/**
 * 获取用户通行证信息（用于 v2 cookie 获取 ltuid）
 */
export const fetchUserFullInfo = async (cookie: string): Promise<{ uid?: string; nickname?: string } | null> => {
  try {
    const res = await fetch(USER_FULL_INFO_URL, {
      method: 'get',
      headers: {
        Cookie: cookie,
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
        Host: 'bbs-api.mihoyo.com',
        Origin: 'https://m.bbs.mihoyo.com',
        Referer: 'https://m.bbs.mihoyo.com/'
      }
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as { data?: { user_info?: { uid: string; nickname: string } } };

    return json.data?.user_info ?? null;
  } catch {
    return null;
  }
};
