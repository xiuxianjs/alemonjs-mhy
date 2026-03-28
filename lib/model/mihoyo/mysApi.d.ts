import type { MihoyoGame, MihoyoRegionType } from './types';
export declare const fetchDeviceFp: (uid: string, _cookie: string, regionType: MihoyoRegionType) => Promise<string | null>;
export interface MysApiResponse {
    retcode: number;
    message: string;
    data: any;
    api?: string;
}
export declare const mysApiFetch: (params: {
    uid: string;
    cookie: string;
    api: string;
    game: MihoyoGame;
    query?: Record<string, string | number | boolean>;
    body?: Record<string, unknown>;
    cached?: boolean;
}) => Promise<MysApiResponse | null>;
export interface GameRoleInfo {
    game_uid: string;
    game_biz: string;
    nickname: string;
    region: string;
    level: number;
}
export declare const fetchGameRoles: (cookie: string) => Promise<{
    success: boolean;
    roles: GameRoleInfo[];
    message: string;
}>;
export declare const fetchUserFullInfo: (cookie: string) => Promise<{
    uid?: string;
    nickname?: string;
} | null>;
