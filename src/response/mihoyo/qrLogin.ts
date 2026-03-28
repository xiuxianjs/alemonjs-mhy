/**
 * 扫码登录 响应处理
 * 命令: #扫码登录 / #二维码登录
 */
import QrLoginCard, { type QrStatus } from '@src/img/views/QrLoginCard';
import { addUserUid, bindUserCookie } from '@src/model/mihoyo/account';
import {
  clearQrSession,
  fetchTokenByGameToken,
  getQrSession,
  qrCodeFetch,
  qrCodeQuery,
  saveUserStoken,
  setQrSession,
  type StokenData
} from '@src/model/mihoyo/stoken';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';
import QRCode from 'qrcode';

const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 60;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const QR_OPTIONS: QRCode.QRCodeToDataURLOptions = {
  width: 300,
  margin: 2,
  color: { dark: '#4a3a20', light: '#ffffff' }
};

const gameNames: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const randomDeviceId = (len: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

/** 渲染扫码卡片并发送图片 */
const sendQrCard = async (message: ReturnType<typeof useMessage>[0], qrDataUrl: string, status: QrStatus, uidLines?: string[]) => {
  const img = await renderComponentIsHtmlToBuffer(
    QrLoginCard,
    {
      data: { qrDataUrl, status, uidLines }
    },
    {}
  );

  const format = Format.create();

  if (typeof img === 'boolean') {
    const md = Format.createMarkdown();

    md.addText(status === 'confirmed' ? '扫码登录成功！' : '图片渲染失败');
    format.addMarkdown(md);
  } else {
    format.addImage(img);
  }

  void message.send({ format });
};

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;

  // 检查是否有未过期的 QR 会话，有则直接重发缓存的二维码
  const cached = await getQrSession(userId);

  if (cached) {
    await sendQrCard(message, cached.qrDataUrl, 'waiting');

    return;
  }

  // 生成设备 ID 并请求二维码
  const device = randomDeviceId(64);
  const qrResult = await qrCodeFetch(device);

  if (!qrResult) {
    await sendQrCard(message, '', 'error');

    return;
  }

  // 生成二维码 DataURL 并发送图片卡
  const qrDataUrl = await QRCode.toDataURL(qrResult.url, QR_OPTIONS);

  await sendQrCard(message, qrDataUrl, 'waiting');

  // 缓存 QR 会话
  await setQrSession(userId, { device, ticket: qrResult.ticket, qrDataUrl });

  // 轮询二维码扫描状态
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
        // 扫码成功，通过 game_token 获取 stoken 和 cookie
        const tokens = await fetchTokenByGameToken(status.raw.uid, status.raw.token);

        if (!tokens) {
          await sendQrCard(message, qrDataUrl, 'error');

          return;
        }

        // 构建 cookie 并绑定
        const fullCookie = `ltoken=${tokens.ltoken};ltuid=${tokens.stuid};cookie_token=${tokens.cookieToken};account_id=${tokens.stuid};`;
        const ckResult = await bindUserCookie(userId, fullCookie);

        // 保存 stoken
        const mainUid = ckResult.uids ? (ckResult.uids.gs[0] ?? ckResult.uids.sr[0] ?? ckResult.uids.zzz[0] ?? '') : '';

        const stData: StokenData = {
          stuid: tokens.stuid,
          stoken: tokens.stoken,
          ltoken: tokens.ltoken,
          mid: tokens.mid,
          uid: mainUid,
          userId
        };

        await saveUserStoken(userId, stData);

        // 同步 UID
        if (ckResult.uids) {
          for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
            for (const uid of ckResult.uids[game]) {
              await addUserUid(userId, game, uid);
            }
          }
        }

        // 发送结果图片
        const uidLines: string[] = [];

        if (ckResult.uids) {
          for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
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

    // 超时
    await sendQrCard(message, qrDataUrl, 'expired');
  } finally {
    await clearQrSession(userId);
  }
};
