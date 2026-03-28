/**
 * 武器查询
 * 命令: #武器 / #五星武器 / #四星武器
 */
import WeaponCard from '@src/img/views/WeaponCard.js';
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

interface CharacterListData {
  avatars: Array<{
    id: number;
    name: string;
    rarity: number;
    level: number;
    weapon: {
      id: number;
      name: string;
      icon: string;
      type_name: string;
      rarity: number;
      level: number;
      affix_level: number;
    };
  }>;
}

// ─── 入口 ────────────────────────────────────────────

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';

  const result = await queryMihoyoApi({
    userId,
    game: 'gs',
    api: 'character',
    body: {}
  });

  const format = Format.create();

  if (!result.success) {
    const md = Format.createMarkdown();

    md.addText(`[武器] ${result.message}`);
    format.addMarkdown(md);
  } else {
    const data = result.data as CharacterListData;
    const img = await renderComponentIsHtmlToBuffer(WeaponCard, {
      data: { uid: result.uid ?? '', avatars: data.avatars, filterText: text }
    });

    format.addImage(img);
  }

  void message.send({ format });
};
