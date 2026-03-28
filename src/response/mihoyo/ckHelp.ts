/**
 * CK帮助 / Cookie教程
 * 命令: #ck帮助 / #cookie帮助
 */
import CkHelpCard from '@src/img/views/CkHelpCard';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

// ─── 入口 ────────────────────────────────────────────

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);

  const img = await renderComponentIsHtmlToBuffer(CkHelpCard, {});

  if (typeof img === 'boolean') {
    const md = Format.createMarkdown();

    md.addText('Cookie帮助图片加载失败，请稍后重试');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const format = Format.create();

  format.addImage(img);
  void message.send({ format });
};
