const gameBizMap = {
    gs: ['hk4e_cn', 'hk4e_global'],
    sr: ['hkrpg_cn', 'hkrpg_global'],
    zzz: ['nap_cn', 'nap_global']
};
const parseCookieFields = (raw) => {
    const cleaned = raw.replace(/[#'"]/g, '');
    const fields = {};
    cleaned.split(';').forEach(segment => {
        const trimmed = segment.trim();
        if (!trimmed) {
            return;
        }
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
const isCookieLike = (raw) => {
    const hasToken = /ltoken(_v2)?=/.test(raw);
    const hasUid = /ltuid|login_uid|ltmid_v2/.test(raw);
    return hasToken && hasUid;
};
const extractLtuid = (fields) => {
    const candidate = fields.ltuid ?? fields.ltuidV2 ?? fields.accountIdV2 ?? fields.ltmidV2 ?? null;
    if (!candidate) {
        return null;
    }
    if (/^\d{4,10}$/.test(candidate)) {
        return candidate;
    }
    return candidate;
};
const buildCookieString = (fields) => {
    const hasToken = fields.cookieToken ?? fields.cookieTokenV2;
    if (!hasToken) {
        return null;
    }
    const ltuid = extractLtuid(fields);
    if (!ltuid) {
        return null;
    }
    const isV2 = !!(fields.cookieTokenV2 && (fields.accountMidV2 ?? fields.ltmidV2));
    let ck;
    if (isV2) {
        const parts = [
            `ltuid=${fields.ltuid ?? fields.loginUid ?? fields.ltuidV2 ?? ''}`,
            `account_mid_v2=${fields.accountMidV2 ?? ''}`,
            `cookie_token_v2=${fields.cookieTokenV2 ?? ''}`,
            `ltoken_v2=${fields.ltokenV2 ?? ''}`,
            `ltmid_v2=${fields.ltmidV2 ?? ''}`
        ];
        ck = parts.join(';') + ';';
    }
    else {
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
const extractGameUids = (playerList) => {
    const result = { gs: [], sr: [], zzz: [] };
    for (const player of playerList) {
        for (const [game, bizList] of Object.entries(gameBizMap)) {
            if (bizList.includes(player.game_biz)) {
                result[game].push(player.game_uid);
            }
        }
    }
    return result;
};

export { buildCookieString, extractGameUids, extractLtuid, isCookieLike, parseCookieFields };
