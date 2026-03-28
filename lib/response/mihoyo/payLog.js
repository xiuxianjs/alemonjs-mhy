import { getIoRedis } from '@alemonjs/db';
import { mihoyoKeys } from '../../model/keys.js';
import { getUserMainUid } from '../../model/mihoyo/account.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const AUTHKEY_EXPIRY = 86400;
const PAYDATA_EXPIRY = 86400 * 30;
const BASE_URL = 'https://hk4e-api.mihoyo.com/common/hk4e_self_help_query/User';
const HEADERS = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site'
};
const buildQueryUrl = (api, authkey, endId = '') => {
    const pathMap = {
        getUserInfo: '/GetUserInfo',
        getPrimogemLog: '/GetPrimogemLog',
        getCrystalLog: '/GetCrystalLog'
    };
    const path = pathMap[api] ?? '/GetCrystalLog';
    const params = new URLSearchParams({
        selfquery_type: '1',
        sign_type: '2',
        auth_appid: 'csc',
        authkey_ver: '1',
        game_biz: 'hk4e_cn',
        win_direction: 'portrait',
        bbs_auth_required: 'true',
        bbs_game_role_required: 'hk4e_cn',
        app_client: 'bbs',
        lang: 'zh-cn',
        csc_authkey_required: 'true',
        authkey
    });
    if (api !== 'getUserInfo') {
        params.set('add_type', 'produce');
        params.set('size', '20');
        params.set('end_id', endId);
        params.set('page_id', '1');
    }
    return `${BASE_URL}${path}?${params.toString()}`;
};
const getUserInfo = async (authkey) => {
    try {
        const res = await fetch(buildQueryUrl('getUserInfo', authkey), { headers: HEADERS });
        const json = (await res.json());
        if (json.retcode === -101) {
            return { errorMsg: '链接已过期，请重新获取' };
        }
        if (json.retcode === -100) {
            return { errorMsg: '链接不正确，请重新获取' };
        }
        if (/unknown auth appid/.test(json.message)) {
            return { errorMsg: '该链接无法获取充值记录，请使用客服页面链接' };
        }
        if (json.data?.uid) {
            return { uid: json.data.uid };
        }
        return { errorMsg: `获取失败 (${json.retcode})` };
    }
    catch {
        return { errorMsg: '请求失败' };
    }
};
const fetchCrystalLog = async (authkey) => {
    const allRecords = [];
    let endId = '';
    for (let page = 0; page < 50; page++) {
        try {
            const res = await fetch(buildQueryUrl('getCrystalLog', authkey, endId), { headers: HEADERS });
            const json = (await res.json());
            if (json.retcode === -101 || json.retcode === -100) {
                return { records: allRecords, errorMsg: '链接已过期' };
            }
            const list = json.data?.list ?? [];
            allRecords.push(...list);
            if (list.length < 20) {
                break;
            }
            endId = list[list.length - 1].id;
        }
        catch {
            break;
        }
    }
    return { records: allRecords };
};
const processPayData = (records, uid) => {
    const priceMap = {
        8080: 648,
        3880: 328,
        2240: 198,
        1090: 98,
        330: 30,
        60: 6,
        300: 30,
        680: 68
    };
    let crystal = 0;
    let totalRmb = 0;
    for (const r of records) {
        const num = Number(r.add_num);
        if (num <= 0) {
            continue;
        }
        crystal += num;
        totalRmb += priceMap[num] ?? 0;
    }
    return { uid, crystal, totalRmb, records: records.length };
};
const fetchAndSavePayData = async (authkey, userId, sendMsg) => {
    const redis = getIoRedis();
    const userInfo = await getUserInfo(authkey);
    if (userInfo.errorMsg) {
        sendMsg(`获取失败: ${userInfo.errorMsg}`);
        return null;
    }
    const { records, errorMsg } = await fetchCrystalLog(authkey);
    if (errorMsg && records.length === 0) {
        sendMsg(`获取失败: ${errorMsg}`);
        return null;
    }
    const payData = processPayData(records, userInfo.uid);
    await redis.setex(mihoyoKeys.authKeyByUid(payData.uid), AUTHKEY_EXPIRY, authkey);
    await redis.setex(mihoyoKeys.payLogByUser(userId), PAYDATA_EXPIRY, JSON.stringify(payData));
    return payData;
};
const formatPayData = (data) => {
    return [`【充值统计】 UID:${data.uid}`, '', `总结晶: ${data.crystal}`, `预估消费: ￥${data.totalRmb}`, `充值记录数: ${data.records}条`].join('\n');
};
var payLog = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const text = e.MessageText ?? '';
    const redis = getIoRedis();
    const sendText = (content) => {
        const md = Format.createMarkdown();
        md.addText(content);
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
    };
    if (/帮助/.test(text)) {
        sendText([
            '【充值记录 使用帮助】',
            '',
            '1. 在米游社App中进入客服页面',
            '2. 复制页面链接(包含authkey)',
            '3. 私聊发送该链接',
            '4. 发送 #充值记录 查看统计',
            '',
            '安卓教程: https://b23.tv/K5qfLad'
        ].join('\n'));
        return;
    }
    if (/authkey=/.test(text)) {
        const match = text.match(/authkey=([^&\s\u4e00-\u9fa5]+)/);
        if (!match) {
            sendText('链接无效，未找到authkey，请重新发送');
            return;
        }
        const authkey = decodeURIComponent(match[1]);
        sendText('正在获取充值数据，可能需要30秒...');
        const payData = await fetchAndSavePayData(authkey, userId, sendText);
        if (payData) {
            sendText(formatPayData(payData));
        }
        return;
    }
    if (/更新/.test(text)) {
        const uid = await getUserMainUid(userId, 'gs');
        if (uid) {
            const savedKey = await redis.get(mihoyoKeys.authKeyByUid(uid));
            if (savedKey) {
                sendText('正在更新充值数据...');
                const payData = await fetchAndSavePayData(savedKey, userId, sendText);
                if (payData) {
                    sendText(formatPayData(payData));
                }
                return;
            }
        }
        sendText('请先私聊发送米游社客服页面链接\n可发送 #充值帮助 查看教程');
        return;
    }
    const cached = await redis.get(mihoyoKeys.payLogByUser(userId));
    if (cached) {
        const payData = JSON.parse(cached);
        sendText(formatPayData(payData) + '\n\n发送 #更新充值记录 可刷新数据');
        return;
    }
    const uid = await getUserMainUid(userId, 'gs');
    if (uid) {
        const savedKey = await redis.get(mihoyoKeys.authKeyByUid(uid));
        if (savedKey) {
            sendText('正在获取充值数据...');
            const payData = await fetchAndSavePayData(savedKey, userId, sendText);
            if (payData) {
                sendText(formatPayData(payData));
                return;
            }
        }
    }
    sendText('暂无充值数据，请私聊发送米游社客服页面链接\n可发送 #充值帮助 查看教程');
};

export { payLog as default };
