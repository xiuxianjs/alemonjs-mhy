import { getIoRedis } from '@alemonjs/db';
import { mihoyoKeys } from '../keys.js';
import { parseCookieFields, buildCookieString, extractGameUids } from './cookie.js';
import { fetchGameRoles, fetchUserFullInfo } from './mysApi.js';

const COOKIE_EXPIRY_SECONDS = 86400 * 30;
const UID_EXPIRY_SECONDS = 86400 * 90;
const getUserUids = async (userId, game) => {
    const redis = getIoRedis();
    const key = mihoyoKeys.uidByUserAndGame(userId, game);
    const raw = await redis.get(key);
    if (!raw) {
        return [];
    }
    return JSON.parse(raw);
};
const getUserMainUid = async (userId, game) => {
    const uids = await getUserUids(userId, game);
    return uids[0] ?? null;
};
const addUserUid = async (userId, game, uid) => {
    const redis = getIoRedis();
    const key = mihoyoKeys.uidByUserAndGame(userId, game);
    const uids = await getUserUids(userId, game);
    if (uids.includes(uid)) {
        return;
    }
    uids.push(uid);
    await redis.setex(key, UID_EXPIRY_SECONDS, JSON.stringify(uids));
};
const removeUserUid = async (userId, game, uid) => {
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
    }
    else {
        await redis.setex(key, UID_EXPIRY_SECONDS, JSON.stringify(uids));
    }
    return true;
};
const getUserCookie = async (userId) => {
    const redis = getIoRedis();
    const key = mihoyoKeys.cookieByUser(userId);
    const raw = await redis.get(key);
    if (!raw) {
        return null;
    }
    return JSON.parse(raw);
};
const saveUserCookie = async (userId, data) => {
    const redis = getIoRedis();
    const key = mihoyoKeys.cookieByUser(userId);
    await redis.setex(key, COOKIE_EXPIRY_SECONDS, JSON.stringify(data));
};
const deleteUserCookie = async (userId) => {
    const redis = getIoRedis();
    const key = mihoyoKeys.cookieByUser(userId);
    const existed = await redis.exists(key);
    if (existed === 0) {
        return false;
    }
    await redis.del(key);
    return true;
};
const bindUserCookie = async (userId, rawCookie) => {
    const fields = parseCookieFields(rawCookie);
    const cookieResult = buildCookieString(fields);
    if (!cookieResult) {
        return {
            success: false,
            message: '发送的Cookie不完整\n请退出米游社【重新登录】，刷新完整Cookie'
        };
    }
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
    let finalLtuid = cookieResult.ltuid;
    if (cookieResult.isV2 && !/^\d+$/.test(finalLtuid)) {
        const fullInfo = await fetchUserFullInfo(cookieResult.ck);
        if (fullInfo?.uid) {
            finalLtuid = fullInfo.uid;
        }
        else {
            return {
                success: false,
                message: '绑定Cookie失败：无法获取通行证ID'
            };
        }
    }
    const gameUids = extractGameUids(roleResult.roles);
    const storeData = {
        ck: cookieResult.ck,
        ltuid: finalLtuid,
        isV2: cookieResult.isV2,
        uids: gameUids
    };
    await saveUserCookie(userId, storeData);
    for (const game of ['gs', 'sr', 'zzz']) {
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

export { addUserUid, bindUserCookie, deleteUserCookie, getUserCookie, getUserMainUid, getUserUids, removeUserUid };
