export type MihoyoGame = 'gs' | 'sr' | 'zzz';

export type MihoyoRegionType = 'cn' | 'global';

export interface MihoyoRegionProfile {
  game: MihoyoGame;
  server: string;
  type: MihoyoRegionType;
}

export interface MihoyoApiRequest {
  api: string;
  game: MihoyoGame;
  uid: string;
  query?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
}

export interface MihoyoApiEndpoint {
  host: string;
  path: string;
  method: 'GET' | 'POST';
  /** POST 时自动将 role_id/server 注入 body */
  includeRoleId?: boolean;
}

export interface MihoyoApiUrlResult {
  url: string;
  method: 'GET' | 'POST';
  /** URL query string（不含 ?），用于 DS 签名 */
  query: string;
  /** POST 端点自动注入的 body 字段 */
  defaultBody: Record<string, unknown>;
}
