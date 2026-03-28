import type { MihoyoGame } from './types';
export interface QueryResult {
    success: boolean;
    message: string;
    data?: any;
    uid?: string;
    api?: string;
}
export declare const queryMihoyoApi: (params: {
    userId: string;
    game: MihoyoGame;
    api: string;
    query?: Record<string, string | number | boolean>;
    body?: Record<string, unknown>;
    cached?: boolean;
}) => Promise<QueryResult>;
