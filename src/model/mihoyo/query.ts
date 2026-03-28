/**
 * 通用查询服务
 * 根据用户 ID 获取 Cookie + UID，发起米游社 API 请求
 */
import { getUserCookie, getUserMainUid } from './account';
import { type MysApiResponse, mysApiFetch } from './mysApi';
import type { MihoyoGame } from './types';

export interface QueryResult {
  success: boolean;
  message: string;
  data?: any;
  uid?: string;
  api?: string;
}

const RETCODE_MESSAGES: Record<number, string> = {
  [-1]: '请求异常，请稍后重试',
  [-100]: 'Cookie已失效，请重新绑定',
  [-10001]: 'Cookie已失效，请重新绑定',
  [10001]: '绑定的Cookie已过期',
  [10101]: '查询过于频繁，请稍后再试',
  [10102]: '当前查询较多，请稍后再试',
  [10103]: 'Cookie无效，请重新绑定',
  [10104]: '暂无该角色数据，请前往米游社开启数据展示',
  [1034]: '请完成米游社验证后再查询',
  [5003]: '尚未开启实时便笺功能',
  [12118]: '请先前往米游社开启数据展示'
};

const formatRetcode = (res: MysApiResponse): string => {
  return RETCODE_MESSAGES[res.retcode] ?? `接口返回错误 [${res.retcode}] ${res.message}`;
};

/**
 * 执行米游社查询
 */
export const queryMihoyoApi = async (params: {
  userId: string;
  game: MihoyoGame;
  api: string;
  query?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
  cached?: boolean;
}): Promise<QueryResult> => {
  const { userId, game, api, query, body, cached } = params;

  // 1. 获取 Cookie
  const cookieData = await getUserCookie(userId);

  if (!cookieData) {
    return {
      success: false,
      message: '尚未绑定Cookie，请先发送Cookie进行绑定'
    };
  }

  // 2. 获取 UID
  const uid = await getUserMainUid(userId, game);

  if (!uid) {
    return {
      success: false,
      message: `尚未绑定${game === 'gs' ? '原神' : game === 'sr' ? '星穹铁道' : '绝区零'}UID`
    };
  }

  // 3. 请求 API
  const res = await mysApiFetch({
    uid,
    cookie: cookieData.ck,
    api,
    game,
    query,
    body,
    cached: cached ?? true
  });

  if (!res) {
    return {
      success: false,
      message: '请求米游社接口失败，请稍后重试',
      uid
    };
  }

  if (res.retcode !== 0) {
    return {
      success: false,
      message: formatRetcode(res),
      uid
    };
  }

  return {
    success: true,
    message: 'ok',
    data: res.data,
    uid,
    api: res.api
  };
};
