/**
 * 我的Cookie / 删除Cookie
 * 命令: #我的ck / #删除ck
 */
import { mihoyoConstants } from '@src/constants/mihoyo';
import { deleteUserCookie, getUserCookie } from '@src/model/mihoyo/account';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const MASK_KEEP = mihoyoConstants.ckMaskKeepLength;

const maskCookie = (ck: string): string => {
  if (ck.length <= MASK_KEEP * 2) {
    return '***';
  }

  return ck.slice(0, MASK_KEEP) + '***' + ck.slice(-MASK_KEEP);
};

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';
  const isDelete = /删除/.test(text);

  const md = Format.createMarkdown();

  if (isDelete) {
    const deleted = await deleteUserCookie(userId);

    if (deleted) {
      md.addText('已删除绑定的Cookie');
    } else {
      md.addText('当前没有绑定的Cookie');
    }

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 显示当前 cookie 信息
  const stored = await getUserCookie(userId);

  if (!stored) {
    md.addText('当前未绑定Cookie');
    md.addNewline();
    md.addText('请私聊发送Cookie进行绑定');
    const earlyFormat = Format.create();

    earlyFormat.addMarkdown(md);
    void message.send({ format: earlyFormat });

    return;
  }

  const lines: string[] = [`ltuid: ${stored.ltuid}`, `格式: ${stored.isV2 ? 'v2' : 'v1'}`, `Cookie: ${maskCookie(stored.ck)}`];

  for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
    const uids = stored.uids[game];

    if (uids.length > 0) {
      lines.push(`【${GAME_NAMES[game]}】: ${uids.join(', ')}`);
    }
  }

  md.addText(lines.join('\n'));

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
