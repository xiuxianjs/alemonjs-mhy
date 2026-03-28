import QrLoginCard from '../../img/views/QrLoginCard.js';
import { bindUserCookie, addUserUid } from '../../model/mihoyo/account.js';
import { getQrSession, qrCodeFetch, setQrSession, qrCodeQuery, fetchTokenByGameToken, saveUserStoken, clearQrSession } from '../../model/mihoyo/stoken.js';
import { createEvent, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';
import QRCode from 'qrcode';

const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 60;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const QR_OPTIONS = {
    width: 300,
    margin: 2,
    color: { dark: '#4a3a20', light: '#ffffff' }
};
const gameNames = {
    gs: '原神',
    sr: '星穹铁道',
    zzz: '绝区零'
};
const randomDeviceId = (len) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};
const sendQrCard = async (message, qrDataUrl, status, uidLines) => {
    const img = await renderComponentIsHtmlToBuffer(QrLoginCard, {
        data: { qrDataUrl, status, uidLines }
    }, {});
    const format = Format.create();
    if (typeof img === 'boolean') {
        const md = Format.createMarkdown();
        md.addText(status === 'confirmed' ? '扫码登录成功！' : '图片渲染失败');
        format.addMarkdown(md);
    }
    else {
        format.addImage(img);
    }
    void message.send({ format });
};
var qrLogin = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const cached = await getQrSession(userId);
    if (cached) {
        await sendQrCard(message, cached.qrDataUrl, 'waiting');
        return;
    }
    const device = randomDeviceId(64);
    const qrResult = await qrCodeFetch(device);
    if (!qrResult) {
        await sendQrCard(message, '', 'error');
        return;
    }
    const qrDataUrl = await QRCode.toDataURL(qrResult.url, QR_OPTIONS);
    await sendQrCard(message, qrDataUrl, 'waiting');
    await setQrSession(userId, { device, ticket: qrResult.ticket, qrDataUrl });
    let hasNotifiedScan = false;
    try {
        for (let i = 0; i < MAX_POLLS; i++) {
            await sleep(POLL_INTERVAL_MS);
            const status = await qrCodeQuery(device, qrResult.ticket);
            if (!status) {
                continue;
            }
            if (status.stat === 'Scanned' && !hasNotifiedScan) {
                hasNotifiedScan = true;
                await sendQrCard(message, qrDataUrl, 'scanned');
            }
            if (status.stat === 'Confirmed' && status.raw) {
                const tokens = await fetchTokenByGameToken(status.raw.uid, status.raw.token);
                if (!tokens) {
                    await sendQrCard(message, qrDataUrl, 'error');
                    return;
                }
                const fullCookie = `ltoken=${tokens.ltoken};ltuid=${tokens.stuid};cookie_token=${tokens.cookieToken};account_id=${tokens.stuid};`;
                const ckResult = await bindUserCookie(userId, fullCookie);
                const mainUid = ckResult.uids ? (ckResult.uids.gs[0] ?? ckResult.uids.sr[0] ?? ckResult.uids.zzz[0] ?? '') : '';
                const stData = {
                    stuid: tokens.stuid,
                    stoken: tokens.stoken,
                    ltoken: tokens.ltoken,
                    mid: tokens.mid,
                    uid: mainUid,
                    userId
                };
                await saveUserStoken(userId, stData);
                if (ckResult.uids) {
                    for (const game of ['gs', 'sr', 'zzz']) {
                        for (const uid of ckResult.uids[game]) {
                            await addUserUid(userId, game, uid);
                        }
                    }
                }
                const uidLines = [];
                if (ckResult.uids) {
                    for (const game of ['gs', 'sr', 'zzz']) {
                        if (ckResult.uids[game].length > 0) {
                            uidLines.push(`【${gameNames[game]}】: ${ckResult.uids[game].join(', ')}`);
                        }
                    }
                }
                await sendQrCard(message, qrDataUrl, 'confirmed', uidLines);
                logger.mark(`[扫码登录] 用户 ${userId} 登录成功 [stuid:${tokens.stuid}]`);
                return;
            }
            if (status.stat === 'Expired') {
                break;
            }
        }
        await sendQrCard(message, qrDataUrl, 'expired');
    }
    finally {
        await clearQrSession(userId);
    }
};

export { qrLogin as default };
