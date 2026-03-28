/**
 * 绑定Cookie 响应处理
 * 命令: #绑定cookie / 私聊直接发送cookie
 */
import { bindUserCookie } from '@src/model/mihoyo/account';
import { isCookieLike } from '@src/model/mihoyo/cookie';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const gameNames: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const isPrivate = /private/.test(event.name);

  // 提取 cookie：可能来自消息文本
  const rawCk = e.MessageText ?? '';

  // 如果是 #绑定cookie 命令，cookie 应在后续消息中（此处仅处理直接发送的情况）
  if (/^(!|！|\/|#|＃)绑定c(oo)?k(ie)?$/i.test(rawCk)) {
    const md = Format.createMarkdown();

    md.addText('请在【私聊】中直接发送你的米游社Cookie');
    md.addNewline();
    md.addText('获取方式：浏览器登录米游社，F12打开控制台，输入 document.cookie');
    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 检查是否为 cookie 格式
  if (!isCookieLike(rawCk)) {
    return;
  }

  // 必须私聊
  if (!isPrivate) {
    const md = Format.createMarkdown();

    md.addText('请私聊发送Cookie，不要在群里发送！');
    const warnFormat = Format.create();

    warnFormat.addMarkdown(md);
    void message.send({ format: warnFormat });

    return;
  }

  // 执行绑定
  const result = await bindUserCookie(userId, rawCk);

  const md = Format.createMarkdown();

  md.addText(result.message);
  md.addNewline();

  if (result.success && result.uids) {
    const lines: string[] = [];

    for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
      const uids = result.uids[game];

      if (uids.length > 0) {
        lines.push(`【${gameNames[game]}】: ${uids.join(', ')}`);
      }
    }

    if (lines.length > 0) {
      md.addText(lines.join('\n'));
    }
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
