/**
 * Cookie 解析与构建
 * 从原始 cookie 字符串中提取关键字段，并拼接标准化 cookie
 */
import type { MihoyoGame } from './types';

/** cookie 字段名 → 值 的映射 */
export interface CookieFields {
  ltoken?: string;
  ltokenV2?: string;
  ltuid?: string;
  ltuidV2?: string;
  loginUid?: string;
  accountIdV2?: string;
  accountMidV2?: string;
  ltmidV2?: string;
  cookieToken?: string;
  cookieTokenV2?: string;
  mi18nLang?: string;
  loginTicket?: string;
}

/** 绑定结果 */
export interface CookieBindResult {
  /** 标准化后的 cookie 字符串 */
  ck: string;
  /** 提取出的 ltuid（作为主键） */
  ltuid: string;
  /** 是否为 v2 格式 */
  isV2: boolean;
  /** 登录 ticket（签到用） */
  loginTicket: string;
}

/** cookie 验证对应的游戏业务标识 */
const gameBizMap: Record<MihoyoGame, string[]> = {
  gs: ['hk4e_cn', 'hk4e_global'],
  sr: ['hkrpg_cn', 'hkrpg_global'],
  zzz: ['nap_cn', 'nap_global']
};

/**
 * 从原始 cookie 字符串中提取字段
 */
export const parseCookieFields = (raw: string): CookieFields => {
  const cleaned = raw.replace(/[#'"]/g, '');
  const fields: CookieFields = {};

  cleaned.split(';').forEach(segment => {
    const trimmed = segment.trim();

    if (!trimmed) {
      return;
    }

    // 用第一个 = 分割，避免 value 中含有 = 被误切
    const eqIndex = trimmed.indexOf('=');

    if (eqIndex < 1) {
      return;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();

    switch (key) {
      case 'ltoken':
        fields.ltoken = value;
        break;
      case 'ltoken_v2':
        fields.ltokenV2 = value;
        break;
      case 'ltuid':
        fields.ltuid = value;
        break;
      case 'ltuid_v2':
        fields.ltuidV2 = value;
        break;
      case 'login_uid':
        fields.loginUid = value;
        break;
      case 'account_id_v2':
        fields.accountIdV2 = value;
        break;
      case 'account_mid_v2':
        fields.accountMidV2 = value;
        break;
      case 'ltmid_v2':
        fields.ltmidV2 = value;
        break;
      case 'cookie_token':
        fields.cookieToken = value;
        break;
      case 'cookie_token_v2':
        fields.cookieTokenV2 = value;
        break;
      case 'mi18nLang':
        fields.mi18nLang = value;
        break;
      case 'login_ticket':
        fields.loginTicket = value;
        break;
    }
  });

  return fields;
};

/**
 * 判断原始 cookie 字符串是否包含有效的 token+uid 字段
 */
export const isCookieLike = (raw: string): boolean => {
  const hasToken = /ltoken(_v2)?=/.test(raw);
  const hasUid = /ltuid|login_uid|ltmid_v2/.test(raw);

  return hasToken && hasUid;
};

/**
 * 从解析后的字段中提取 ltuid 主键
 */
export const extractLtuid = (fields: CookieFields): string | null => {
  const candidate = fields.ltuid ?? fields.ltuidV2 ?? fields.accountIdV2 ?? fields.ltmidV2 ?? null;

  if (!candidate) {
    return null;
  }

  // 纯数字形式优先（传统 ltuid）
  if (/^\d{4,10}$/.test(candidate)) {
    return candidate;
  }

  // v2 格式也合法
  return candidate;
};

/**
 * 构建标准化 cookie 字符串
 */
export const buildCookieString = (fields: CookieFields): CookieBindResult | null => {
  const hasToken = fields.cookieToken ?? fields.cookieTokenV2;

  if (!hasToken) {
    return null;
  }

  const ltuid = extractLtuid(fields);

  if (!ltuid) {
    return null;
  }

  const isV2 = !!(fields.cookieTokenV2 && (fields.accountMidV2 ?? fields.ltmidV2));

  let ck: string;

  if (isV2) {
    const parts = [
      `ltuid=${fields.ltuid ?? fields.loginUid ?? fields.ltuidV2 ?? ''}`,
      `account_mid_v2=${fields.accountMidV2 ?? ''}`,
      `cookie_token_v2=${fields.cookieTokenV2 ?? ''}`,
      `ltoken_v2=${fields.ltokenV2 ?? ''}`,
      `ltmid_v2=${fields.ltmidV2 ?? ''}`
    ];

    ck = parts.join(';') + ';';
  } else {
    const parts = [
      `ltoken=${fields.ltoken ?? ''}`,
      `ltuid=${fields.ltuid ?? fields.loginUid ?? ''}`,
      `cookie_token=${fields.cookieToken ?? fields.cookieTokenV2 ?? ''}`,
      `account_id=${fields.ltuid ?? fields.loginUid ?? ''}`
    ];

    ck = parts.join(';') + ';';
  }

  if (fields.mi18nLang) {
    ck += ` mi18nLang=${fields.mi18nLang};`;
  }

  return {
    ck,
    ltuid,
    isV2,
    loginTicket: fields.loginTicket ?? ''
  };
};

/**
 * 从 getUserGameRolesByCookie 返回的角色列表中，筛选各游戏 UID
 */
export const extractGameUids = (playerList: Array<{ game_uid: string; game_biz: string }>): Record<MihoyoGame, string[]> => {
  const result: Record<MihoyoGame, string[]> = { gs: [], sr: [], zzz: [] };

  for (const player of playerList) {
    for (const [game, bizList] of Object.entries(gameBizMap)) {
      if (bizList.includes(player.game_biz)) {
        result[game as MihoyoGame].push(player.game_uid);
      }
    }
  }

  return result;
};
