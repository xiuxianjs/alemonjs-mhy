import type { MihoyoGame } from './types';
export interface StokenData {
    stuid: string;
    stoken: string;
    ltoken: string;
    mid?: string;
    uid: string;
    userId: string;
}
export declare const getUserStoken: (userId: string) => Promise<StokenData | null>;
export declare const saveUserStoken: (userId: string, data: StokenData) => Promise<void>;
export declare const deleteUserStoken: (userId: string) => Promise<boolean>;
export declare const buildStokenCookie: (data: StokenData) => string;
export declare const fetchStokenByLoginTicket: (loginTicket: string, loginUid: string) => Promise<{
    stoken: string;
    ltoken: string;
} | null>;
export declare const fetchCookieTokenByStoken: (stokenCookie: string) => Promise<string | null>;
export declare const fetchLtokenByStoken: (stokenCookie: string) => Promise<string | null>;
export declare const fetchGameUidsByStoken: (stokenCookie: string) => Promise<{
    uids: Record<MihoyoGame, string[]>;
    roles: Array<{
        game_uid: string;
        game_biz: string;
        region: string;
        region_name: string;
        nickname: string;
    }>;
} | null>;
export interface BindStokenResult {
    success: boolean;
    message: string;
    uids?: Record<MihoyoGame, string[]>;
}
export declare const bindStoken: (userId: string, rawStoken: string) => Promise<BindStokenResult>;
export declare const qrCodeFetch: (device: string) => Promise<{
    url: string;
    ticket: string;
} | null>;
export type QrCodeStatus = 'Init' | 'Scanned' | 'Confirmed' | 'Expired';
export declare const qrCodeQuery: (device: string, ticket: string) => Promise<{
    stat: QrCodeStatus;
    raw?: {
        uid: string;
        token: string;
    };
} | null>;
export declare const fetchTokenByGameToken: (gameUid: string, gameToken: string) => Promise<{
    stoken: string;
    stuid: string;
    mid: string;
    ltoken: string;
    cookieToken: string;
} | null>;
export interface QrSession {
    device: string;
    ticket: string;
    qrDataUrl: string;
}
export declare const getQrSession: (userId: string) => Promise<QrSession | null>;
export declare const setQrSession: (userId: string, session: QrSession) => Promise<void>;
export declare const clearQrSession: (userId: string) => Promise<void>;
