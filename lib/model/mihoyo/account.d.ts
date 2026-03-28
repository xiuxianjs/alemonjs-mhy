import type { MihoyoGame } from './types';
export declare const getUserUids: (userId: string, game: MihoyoGame) => Promise<string[]>;
export declare const getUserMainUid: (userId: string, game: MihoyoGame) => Promise<string | null>;
export declare const addUserUid: (userId: string, game: MihoyoGame, uid: string) => Promise<void>;
export declare const removeUserUid: (userId: string, game: MihoyoGame, uid: string) => Promise<boolean>;
export interface StoredCookieData {
    ck: string;
    ltuid: string;
    isV2: boolean;
    uids: Record<MihoyoGame, string[]>;
}
export declare const getUserCookie: (userId: string) => Promise<StoredCookieData | null>;
export declare const deleteUserCookie: (userId: string) => Promise<boolean>;
export interface BindCookieResult {
    success: boolean;
    message: string;
    uids?: Record<MihoyoGame, string[]>;
}
export declare const bindUserCookie: (userId: string, rawCookie: string) => Promise<BindCookieResult>;
