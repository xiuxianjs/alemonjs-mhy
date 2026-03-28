import type { MihoyoGame } from './types';
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
export interface CookieBindResult {
    ck: string;
    ltuid: string;
    isV2: boolean;
    loginTicket: string;
}
export declare const parseCookieFields: (raw: string) => CookieFields;
export declare const isCookieLike: (raw: string) => boolean;
export declare const extractLtuid: (fields: CookieFields) => string | null;
export declare const buildCookieString: (fields: CookieFields) => CookieBindResult | null;
export declare const extractGameUids: (playerList: Array<{
    game_uid: string;
    game_biz: string;
}>) => Record<MihoyoGame, string[]>;
