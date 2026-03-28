/**
 * 邦布查询（绝区零）
 * 命令: #邦布
 */
import BuddyCard from '@src/img/views/BuddyCard.js';
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

interface BuddyData {
  list: Array<{ id: number; name: string; rarity: string; level: number; star: number }>;
}

// ─── 入口 ────────────────────────────────────────────

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;

  const result = await queryMihoyoApi({
    userId,
    game: 'zzz',
    api: 'buddy'
  });

  const format = Format.create();

  if (!result.success) {
    const md = Format.createMarkdown();

    md.addText(`[邦布] ${result.message}`);
    format.addMarkdown(md);
  } else {
    const data = result.data as BuddyData;
    const img = await renderComponentIsHtmlToBuffer(BuddyCard, {
      data: { uid: result.uid ?? '', list: data.list }
    });

    format.addImage(img);
  }

  void message.send({ format });
};
