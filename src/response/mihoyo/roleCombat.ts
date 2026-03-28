/**
 * 幻想真境剧诗
 * 命令: #剧诗 / #幻想真境剧诗
 */
import RoleCombatCard, { type RoleCombatData } from '@src/img/views/RoleCombatCard.js';
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

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
    game: 'gs',
    api: 'roleCombat',
    query: { need_detail: true }
  });

  const format = Format.create();

  if (!result.success) {
    const md = Format.createMarkdown();

    md.addText(`[剧诗] ${result.message}`);
    format.addMarkdown(md);
  } else {
    const cardData = { ...result.data, uid: result.uid ?? '' } as RoleCombatData;
    const img = await renderComponentIsHtmlToBuffer(RoleCombatCard, { data: cardData });

    format.addImage(img);
  }

  void message.send({ format });
};
