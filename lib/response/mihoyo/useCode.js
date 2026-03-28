import { getUserCookie, getUserMainUid } from '../../model/mihoyo/account.js';
import { resolveMihoyoRegion } from '../../model/mihoyo/region.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const CDK_URLS = {
    gs: 'https://sg-hk4e-api.hoyolab.com/common/apicdkey/api/webExchangeCdkeyHyl',
    sr: 'https://sg-hkrpg-api.hoyolab.com/common/apicdkey/api/webExchangeCdkeyHyl',
    zzz: 'https://public-operation-nap.hoyolab.com/common/apicdkey/api/webExchangeCdkeyHyl'
};
const GAME_BIZ = {
    gs: { cn: 'hk4e_cn', global: 'hk4e_global' },
    sr: { cn: 'hkrpg_cn', global: 'hkrpg_global' },
    zzz: { cn: 'nap_cn', global: 'nap_global' }
};
const GAME_NAMES = {
    gs: '原神',
    sr: '星穹铁道',
    zzz: '绝区零'
};
const resolveGame = (text) => {
    if (/星铁|崩铁/.test(text)) {
        return 'sr';
    }
    if (/绝区零/.test(text)) {
        return 'zzz';
    }
    return 'gs';
};
var useCode = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const text = e.MessageText ?? '';
    const game = resolveGame(text);
    const cdkCode = text.replace(/^(!|！|\/|#|＃)(原神|星铁|崩铁|绝区零)?(兑换码使用|cdk-u)/i, '').trim();
    if (!cdkCode) {
        const md = Format.createMarkdown();
        md.addText('请在命令后输入兑换码，如: #兑换码使用ABCD1234');
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const cookieData = await getUserCookie(userId);
    if (!cookieData) {
        const md = Format.createMarkdown();
        md.addText('尚未绑定Cookie，请先绑定后再使用兑换码');
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const uid = await getUserMainUid(userId, game);
    if (!uid) {
        const md = Format.createMarkdown();
        md.addText(`尚未绑定${GAME_NAMES[game]}UID`);
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const region = resolveMihoyoRegion(uid, game);
    const gameBiz = GAME_BIZ[game][region.type];
    const baseUrl = CDK_URLS[game];
    const params = new URLSearchParams({
        cdkey: cdkCode,
        game_biz: gameBiz,
        lang: 'zh-cn',
        region: region.server,
        t: String(Date.now()),
        uid
    });
    const md = Format.createMarkdown();
    try {
        const res = await fetch(`${baseUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                Cookie: cookieData.ck,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/2.40.1'
            }
        });
        const json = (await res.json());
        if (json.retcode === 0) {
            md.addText(`[${GAME_NAMES[game]}] ${json.data?.msg ?? '兑换成功'}`);
        }
        else {
            md.addText(`[${GAME_NAMES[game]}] 兑换失败: ${json.message}`);
        }
    }
    catch {
        md.addText('兑换码使用失败，请稍后重试');
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { useCode as default };
