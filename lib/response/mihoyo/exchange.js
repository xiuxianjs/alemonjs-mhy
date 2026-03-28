import { createEvent, useMessage, Format } from 'alemonjs';

const resolveGame = (text) => {
    if (/星铁|崩铁/.test(text)) {
        return 'sr';
    }
    if (/绝区零/.test(text)) {
        return 'zzz';
    }
    return 'gs';
};
const MIYOLIVE_UIDS = {
    gs: '75276539',
    sr: '80823548',
    zzz: '152039148'
};
const GAME_GIDS = {
    gs: '2',
    sr: '6',
    zzz: '8'
};
const GAME_NAMES = {
    gs: '原神',
    sr: '星穹铁道',
    zzz: '绝区零'
};
const getActIdFromPosts = async (game) => {
    try {
        const uid = MIYOLIVE_UIDS[game];
        const url = `https://bbs-api.mihoyo.com/painter/api/user_instant/list?offset=0&size=20&uid=${uid}`;
        const res = await fetch(url);
        const json = (await res.json());
        if (json.retcode !== 0) {
            return null;
        }
        for (const p of json.data?.list ?? []) {
            const sc = p?.post?.post?.structured_content;
            if (!sc) {
                continue;
            }
            const match = sc.match(/act_id=([a-zA-Z0-9]+)/);
            if (match) {
                return match[1];
            }
        }
        return null;
    }
    catch {
        return null;
    }
};
const getActIdFromNav = async (game) => {
    try {
        const gid = GAME_GIDS[game];
        const url = `https://bbs-api.miyoushe.com/apihub/api/home/new?gids=${gid}&parts=1%2C3%2C4`;
        const res = await fetch(url);
        const json = (await res.json());
        if (json.retcode !== 0) {
            return null;
        }
        const nav = json.data?.navigator?.find(item => /前瞻|特别节目/.test(item.name) && item.app_path.includes('act_id='));
        if (nav) {
            const match = nav.app_path.match(/act_id=([a-zA-Z0-9]+)/);
            if (match) {
                return match[1];
            }
        }
        return null;
    }
    catch {
        return null;
    }
};
const fetchCodesFromMiyolive = async (actId) => {
    try {
        const indexRes = await fetch('https://api-takumi.mihoyo.com/event/miyolive/index', {
            headers: { 'x-rpc-act_id': actId }
        });
        const indexJson = (await indexRes.json());
        if (indexJson.retcode !== 0 || !indexJson.data?.live) {
            return { codes: [], title: '', deadline: '' };
        }
        const { title, code_ver: codeVer, remain } = indexJson.data.live;
        if (remain > 0) {
            return { codes: [], title, deadline: '' };
        }
        const now = Math.floor(Date.now() / 1000);
        const codeRes = await fetch(`https://api-takumi-static.mihoyo.com/event/miyolive/refreshCode?version=${codeVer}&time=${now}`, {
            headers: { 'x-rpc-act_id': actId }
        });
        const codeJson = (await codeRes.json());
        const codeList = codeJson.data?.code_list ?? [];
        const codes = codeList.map(c => c.code).filter(Boolean);
        let deadline = '';
        if (codeList.length > 0 && codeList[0].to_get_time) {
            const date = new Date(codeList[0].to_get_time * 1000);
            date.setDate(date.getDate() + 3);
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            deadline = `${y}-${m}-${d} 23:59:59`;
        }
        return { codes, title, deadline };
    }
    catch {
        return { codes: [], title: '', deadline: '' };
    }
};
var exchange = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const text = e.MessageText ?? '';
    const game = resolveGame(text);
    const md = Format.createMarkdown();
    let actId = await getActIdFromPosts(game);
    actId ??= await getActIdFromNav(game);
    if (!actId) {
        md.addText(`【${GAME_NAMES[game]}·兑换码】\n\n暂未获取到直播活动信息`);
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const { codes, title, deadline } = await fetchCodesFromMiyolive(actId);
    if (codes.length === 0) {
        md.addText(`【${title || GAME_NAMES[game]}·兑换码】\n\n暂无可用兑换码，可能尚未发布或已过期`);
    }
    else {
        const lines = [`【${title || GAME_NAMES[game]}·兑换码】`, '', ...codes.map((code, i) => `${i + 1}. ${code}`)];
        if (deadline) {
            lines.push('', `过期时间: ${deadline}`);
        }
        md.addText(lines.join('\n'));
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { exchange as default };
