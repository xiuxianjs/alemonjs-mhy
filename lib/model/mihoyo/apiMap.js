import { resolveMihoyoRegion } from './region.js';

const cnEndpoints = {
    gs: {
        getFp: { host: 'https://public-data-api.mihoyo.com', path: '/device-fp/api/getFp', method: 'POST' },
        dailyNote: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/dailyNote', method: 'GET' },
        index: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/index', method: 'GET' },
        spiralAbyss: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/spiralAbyss', method: 'GET' },
        roleCombat: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/role_combat', method: 'GET' },
        character: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/character/list', method: 'POST' },
        characterDetail: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/genshin/api/character/detail', method: 'GET' },
        ys_ledger: { host: 'https://hk4e-api.mihoyo.com', path: '/event/ys_ledger/monthInfo', method: 'GET' },
        useCdk: { host: 'https://sg-hk4e-api.hoyolab.com', path: '/common/apicdkey/api/webExchangeCdkeyHyl', method: 'GET' }
    },
    sr: {
        getFp: { host: 'https://public-data-api.mihoyo.com', path: '/device-fp/api/getFp', method: 'POST' },
        dailyNote: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/note', method: 'GET' },
        index: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/index', method: 'GET' },
        basicInfo: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/role/basicInfo', method: 'GET' },
        spiralAbyss: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/challenge', method: 'GET' },
        character: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/avatar/basic', method: 'GET' },
        avatarInfo: { host: 'https://api-takumi-record.mihoyo.com', path: '/game_record/app/hkrpg/api/avatar/info', method: 'GET' },
        ys_ledger: { host: 'https://api-takumi.mihoyo.com', path: '/event/srledger/month_info', method: 'GET' },
        useCdk: { host: 'https://sg-hkrpg-api.hoyolab.com', path: '/common/apicdkey/api/webExchangeCdkeyHyl', method: 'GET' }
    },
    zzz: {
        getFp: { host: 'https://public-data-api.mihoyo.com', path: '/device-fp/api/getFp', method: 'POST' },
        dailyNote: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/note', method: 'GET' },
        index: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/index', method: 'GET' },
        character: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/avatar/basic', method: 'GET' },
        buddy: { host: 'https://api-takumi-record.mihoyo.com', path: '/event/game_record_zzz/api/zzz/buddy/info', method: 'GET' },
        useCdk: { host: 'https://public-operation-nap.hoyolab.com', path: '/common/apicdkey/api/webExchangeCdkeyHyl', method: 'GET' }
    }
};
const osEndpoints = {
    gs: {
        getFp: { host: 'https://sg-public-data-api.hoyoverse.com', path: '/device-fp/api/getFp', method: 'POST' },
        dailyNote: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/genshin/api/dailyNote', method: 'GET' },
        index: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/genshin/api/index', method: 'GET' },
        spiralAbyss: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/genshin/api/spiralAbyss', method: 'GET' },
        character: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/genshin/api/character/list', method: 'POST' },
        roleCombat: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/genshin/api/role_combat', method: 'GET' },
        ys_ledger: { host: 'https://sg-hk4e-api.hoyolab.com', path: '/event/ysledgeros/month_info', method: 'GET' },
        useCdk: { host: 'https://sg-hk4e-api.hoyolab.com', path: '/common/apicdkey/api/webExchangeCdkeyHyl', method: 'GET' }
    },
    sr: {
        getFp: { host: 'https://sg-public-data-api.hoyoverse.com', path: '/device-fp/api/getFp', method: 'POST' },
        dailyNote: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/hkrpg/api/note', method: 'GET' },
        index: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/hkrpg/api/index', method: 'GET' },
        spiralAbyss: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/hkrpg/api/challenge', method: 'GET' },
        character: { host: 'https://bbs-api-os.hoyolab.com', path: '/game_record/app/hkrpg/api/avatar/basic', method: 'GET' },
        ys_ledger: { host: 'https://bbs-api-os.hoyolab.com', path: '/event/srledger/month_info', method: 'GET' },
        useCdk: { host: 'https://sg-hkrpg-api.hoyolab.com', path: '/common/apicdkey/api/webExchangeCdkeyHyl', method: 'GET' }
    },
    zzz: {
        getFp: { host: 'https://sg-public-data-api.hoyoverse.com', path: '/device-fp/api/getFp', method: 'POST' },
        dailyNote: { host: 'https://sg-act-nap-api.hoyolab.com', path: '/event/game_record_zzz/api/zzz/note', method: 'GET' },
        index: { host: 'https://sg-act-nap-api.hoyolab.com', path: '/event/game_record_zzz/api/zzz/index', method: 'GET' },
        character: { host: 'https://sg-act-nap-api.hoyolab.com', path: '/event/game_record_zzz/api/zzz/avatar/basic', method: 'GET' },
        buddy: { host: 'https://sg-act-nap-api.hoyolab.com', path: '/event/game_record_zzz/api/zzz/buddy/info', method: 'GET' },
        useCdk: { host: 'https://public-operation-nap.hoyolab.com', path: '/common/apicdkey/api/webExchangeCdkeyHyl', method: 'GET' }
    }
};
const getEndpoint = (game, api, regionType) => {
    const map = regionType === 'cn' ? cnEndpoints : osEndpoints;
    return map[game]?.[api] ?? null;
};
const buildQueryString = (query) => {
    if (!query) {
        return '';
    }
    const list = [];
    Object.entries(query).forEach(([key, value]) => {
        list.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    });
    return list.join('&');
};
const buildMihoyoApiUrl = (request) => {
    const region = resolveMihoyoRegion(request.uid, request.game);
    const endpoint = getEndpoint(request.game, request.api, region.type);
    if (!endpoint) {
        return null;
    }
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

export { buildMihoyoApiUrl };
