/**
 * 米游社账号服务
 * 管理用户 UID ↔ Cookie 绑定关系（基于 Redis）
 */
import { getIoRedis } from '@alemonjs/db';
import { mihoyoKeys } from '../keys';
import { buildCookieString, extractGameUids, parseCookieFields } from './cookie';
import { fetchGameRoles, fetchUserFullInfo } from './mysApi';
import type { MihoyoGame } from './types';

// ─── 常量 ────────────────────────────────────────────

const COOKIE_EXPIRY_SECONDS = 86400 * 30; // 30 天
const UID_EXPIRY_SECONDS = 86400 * 90; // 90 天

// ─── UID 管理 ────────────────────────────────────────

/**
 * 获取用户绑定的 UID 列表
 */
export const getUserUids = async (userId: string, game: MihoyoGame): Promise<string[]> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.uidByUserAndGame(userId, game);
  const raw = await redis.get(key);

  if (!raw) {
    return [];
  }

  return JSON.parse(raw) as string[];
};

/**
 * 获取用户当前游戏的主 UID（列表中的第一个）
 */
export const getUserMainUid = async (userId: string, game: MihoyoGame): Promise<string | null> => {
  const uids = await getUserUids(userId, game);

  return uids[0] ?? null;
};

/**
 * 添加 UID 到用户绑定列表
 */
export const addUserUid = async (userId: string, game: MihoyoGame, uid: string): Promise<void> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.uidByUserAndGame(userId, game);
  const uids = await getUserUids(userId, game);

  if (uids.includes(uid)) {
    return;
  }

  uids.push(uid);
  await redis.setex(key, UID_EXPIRY_SECONDS, JSON.stringify(uids));
};

/**
 * 从用户绑定列表中移除 UID
 */
export const removeUserUid = async (userId: string, game: MihoyoGame, uid: string): Promise<boolean> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.uidByUserAndGame(userId, game);
  const uids = await getUserUids(userId, game);
  const index = uids.indexOf(uid);

  if (index < 0) {
    return false;
  }

  uids.splice(index, 1);

  if (uids.length === 0) {
    await redis.del(key);
  } else {
    await redis.setex(key, UID_EXPIRY_SECONDS, JSON.stringify(uids));
  }

  return true;
};

// ─── Cookie 管理 ─────────────────────────────────────

/** 存储在 Redis 中的 cookie 数据 */
export interface StoredCookieData {
  ck: string;
  ltuid: string;
  isV2: boolean;
  uids: Record<MihoyoGame, string[]>;
}

/**
 * 获取用户已存储的 cookie 数据
 */
export const getUserCookie = async (userId: string): Promise<StoredCookieData | null> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.cookieByUser(userId);
  const raw = await redis.get(key);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as StoredCookieData;
};

/**
 * 保存用户的 cookie 数据
 */
const saveUserCookie = async (userId: string, data: StoredCookieData): Promise<void> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.cookieByUser(userId);

  await redis.setex(key, COOKIE_EXPIRY_SECONDS, JSON.stringify(data));
};

/**
 * 删除用户的 cookie 数据
 */
export const deleteUserCookie = async (userId: string): Promise<boolean> => {
  const redis = getIoRedis();
  const key = mihoyoKeys.cookieByUser(userId);
  const existed = await redis.exists(key);

  if (existed === 0) {
    return false;
  }

  await redis.del(key);

  return true;
};

// ─── 绑定流程 ────────────────────────────────────────

export interface BindCookieResult {
  success: boolean;
  message: string;
  uids?: Record<MihoyoGame, string[]>;
}

/**
 * 绑定 Cookie：解析 → 验证 → 获取角色 → 存储
 */
export const bindUserCookie = async (userId: string, rawCookie: string): Promise<BindCookieResult> => {
  // 1. 解析 cookie 字段
  const fields = parseCookieFields(rawCookie);
  const cookieResult = buildCookieString(fields);

  if (!cookieResult) {
    return {
      success: false,
      message: '发送的Cookie不完整\n请退出米游社【重新登录】，刷新完整Cookie'
    };
  }

  // 2. 使用 cookie 查询绑定的角色
  const roleResult = await fetchGameRoles(cookieResult.ck);

  if (!roleResult.success) {
    return {
      success: false,
      message: `绑定Cookie失败：${roleResult.message}`
    };
  }

  if (roleResult.roles.length === 0) {
    return {
      success: false,
      message: '该账号尚未绑定原神、星穹铁道或绝区零角色'
    };
  }

  // 3. v2 格式如果 ltuid 是非数字，尝试获取通行证 uid
  let finalLtuid = cookieResult.ltuid;

  if (cookieResult.isV2 && !/^\d+$/.test(finalLtuid)) {
    const fullInfo = await fetchUserFullInfo(cookieResult.ck);

    if (fullInfo?.uid) {
      finalLtuid = fullInfo.uid;
    } else {
      return {
        success: false,
        message: '绑定Cookie失败：无法获取通行证ID'
      };
    }
  }

  // 4. 提取各游戏 UID
  const gameUids = extractGameUids(roleResult.roles);

  // 5. 存储 cookie 数据
  const storeData: StoredCookieData = {
    ck: cookieResult.ck,
    ltuid: finalLtuid,
    isV2: cookieResult.isV2,
    uids: gameUids
  };

  await saveUserCookie(userId, storeData);

  // 6. 同步 UID 到用户绑定列表
  for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
    for (const uid of gameUids[game]) {
      await addUserUid(userId, game, uid);
    }
  }

  logger.mark(`[米游社绑定] 用户 ${userId} 绑定成功 [ltuid:${finalLtuid}]`);

  return {
    success: true,
    message: '绑定Cookie成功',
    uids: gameUids
  };
};
