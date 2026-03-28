/**
 * 体力查询
 * 命令: #体力 / #原神体力 / #星铁体力 / #绝区零体力 / #树脂 / #查询体力
 */
import DailyNoteCard, { type DailyNoteData } from '@src/img/views/DailyNoteCard.js';
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const resolveGame = (text: string): MihoyoGame => {
  if (text.includes('星铁')) {
    return 'sr';
  }

  if (text.includes('绝区零')) {
    return 'zzz';
  }

  return 'gs';
};

// ─── 入口 ────────────────────────────────────────────

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';
  const game = resolveGame(text);

  const result = await queryMihoyoApi({
    userId,
    game,
    api: 'dailyNote'
  });

  const format = Format.create();

  if (!result.success) {
    const md = Format.createMarkdown();

    md.addText(`[${GAME_NAMES[game]}体力] ${result.message}`);
    format.addMarkdown(md);
  } else {
    const noteData = { ...result.data, game, uid: result.uid ?? '' } as DailyNoteData;
    const img = await renderComponentIsHtmlToBuffer(DailyNoteCard, { data: noteData });

    format.addImage(img);
  }

  void message.send({ format });
};
