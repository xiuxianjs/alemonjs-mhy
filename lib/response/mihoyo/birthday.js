import { getUserCookie, getUserMainUid } from '../../model/mihoyo/account.js';
import { resolveMihoyoRegion } from '../../model/mihoyo/region.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const ACTIVITY_ID = '20220301153521';
const getEHk4eToken = async (cookie, uid, region, gameBiz) => {
    const isCn = region.includes('cn');
    const url = isCn ? 'https://api-takumi.mihoyo.com/common/badge/v1/login/account' : 'https://api-os-takumi.mihoyo.com/common/badge/v1/login/account';
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Cookie: cookie,
                'Content-Type': 'application/json;charset=UTF-8',
                Referer: 'https://webstatic.mihoyo.com/',
                Origin: 'https://webstatic.mihoyo.com'
            },
            body: JSON.stringify({
                uid: Number(uid),
                game_biz: gameBiz,
                lang: 'zh-cn',
                region
            })
        });
        const setCookie = res.headers.get('set-cookie');
        const tokenMatch = setCookie?.match(/e_hk4e_token=(.*?);/);
        if (!tokenMatch) {
            return null;
        }
        const json = (await res.json());
        if (json.retcode !== 0) {
            return null;
        }
        return tokenMatch[1];
    }
    catch {
        return null;
    }
};
const getBirthdayStars = async (uid, token, cookie, region, gameBiz) => {
    try {
        const params = new URLSearchParams({
            lang: 'zh-cn',
            badge_uid: uid,
            badge_region: region,
            game_biz: gameBiz,
            activity_id: ACTIVITY_ID
        });
        const url = `https://hk4e-api.mihoyo.com/event/birthdaystar/account/index?${params.toString()}`;
        const res = await fetch(url, {
            headers: { Cookie: `e_hk4e_token=${token};${cookie}` }
        });
        const json = (await res.json());
        return json.data?.role ?? [];
    }
    catch {
        return [];
    }
};
const claimBirthdayDraw = async (uid, token, cookie, region, gameBiz, roleId) => {
    try {
        const params = new URLSearchParams({
            lang: 'zh-cn',
            badge_uid: uid,
            badge_region: region,
            game_biz: gameBiz,
            activity_id: ACTIVITY_ID
        });
        const url = `https://hk4e-api.mihoyo.com/event/birthdaystar/account/post_my_draw?${params.toString()}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Cookie: `e_hk4e_token=${token};${cookie}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role_id: roleId })
        });
        const json = (await res.json());
        return json.retcode === 0 ? 'success' : json.message;
    }
    catch {
        return '请求失败';
    }
};
var birthday = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const game = 'gs';
    const cookieData = await getUserCookie(userId);
    if (!cookieData) {
        const md = Format.createMarkdown();
        md.addText('[留影叙佳期] 请先绑定Cookie');
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const uid = await getUserMainUid(userId, game);
    if (!uid) {
        const md = Format.createMarkdown();
        md.addText('[留影叙佳期] 请先绑定原神UID');
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const region = resolveMihoyoRegion(uid, game);
    const gameBiz = region.type === 'cn' ? 'hk4e_cn' : 'hk4e_global';
    const token = await getEHk4eToken(cookieData.ck, uid, region.server, gameBiz);
    if (!token) {
        const md = Format.createMarkdown();
        md.addText('[留影叙佳期] 获取token失败，请刷新Cookie后重试');
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const roles = await getBirthdayStars(uid, token, cookieData.ck, region.server, gameBiz);
    if (roles.length === 0) {
        const md = Format.createMarkdown();
        md.addText('[留影叙佳期] 今天没有生日角色哦~');
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    for (const role of roles) {
        if (role.take_picture) {
            try {
                const imgRes = await fetch(role.take_picture);
                if (imgRes.ok) {
                    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
                    const imgFormat = Format.create();
                    imgFormat.addImage(imgBuffer);
                    void message.send({ format: imgFormat });
                }
            }
            catch {
            }
        }
        const result = await claimBirthdayDraw(uid, token, cookieData.ck, region.server, gameBiz, role.role_id);
        const resMd = Format.createMarkdown();
        if (result === 'success') {
            resMd.addText(`${role.name}的生日卡片领取成功~`);
        }
        else {
            resMd.addText(`${role.name}: ${result}`);
        }
        const resFormat = Format.create();
        resFormat.addMarkdown(resMd);
        void message.send({ format: resFormat });
    }
};

export { birthday as default };
