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
}

export interface MihoyoApiUrlResult {
  url: string;
  method: 'GET' | 'POST';
}
