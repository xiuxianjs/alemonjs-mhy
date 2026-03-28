import { resolveMihoyoRegion } from './region';
import type { MihoyoApiEndpoint, MihoyoApiRequest, MihoyoApiUrlResult, MihoyoGame } from './types';

const endpointMap: Record<MihoyoGame, Record<string, MihoyoApiEndpoint>> = {
  gs: {
    dailyNote: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/dailyNote', method: 'GET' },
    index: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/index', method: 'GET' },
    spiralAbyss: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/spiralAbyss', method: 'GET' },
    character: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/character/list', method: 'POST' }
  },
  sr: {
    dailyNote: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/note', method: 'GET' },
    index: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/index', method: 'GET' },
    spiralAbyss: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/challenge', method: 'GET' },
    character: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/avatar/basic', method: 'GET' }
  },
  zzz: {
    dailyNote: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/note', method: 'GET' },
    index: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/index', method: 'GET' },
    character: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/avatar/basic', method: 'GET' },
    buddy: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/buddy/info', method: 'GET' }
  }
};

const buildQueryString = (query?: Record<string, string | number | boolean>): string => {
  if (!query) {
    return '';
  }

  const list: string[] = [];

  Object.entries(query).forEach(([key, value]) => {
    list.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });

  return list.join('&');
};

export const buildMihoyoApiUrl = (request: MihoyoApiRequest): MihoyoApiUrlResult | null => {
  const gameMap = endpointMap[request.game];
  const endpoint = gameMap?.[request.api];

  if (!endpoint) {
    return null;
  }

  const region = resolveMihoyoRegion(request.uid, request.game);
  const queryString = buildQueryString({
    role_id: request.uid,
    server: region.server,
    ...(request.query ?? {})
  });

  const finalUrl = queryString.length > 0 ? `${endpoint.host}${endpoint.path}?${queryString}` : `${endpoint.host}${endpoint.path}`;

  return {
    url: finalUrl,
    method: endpoint.method
  };
};
