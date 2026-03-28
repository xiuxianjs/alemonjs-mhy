/**
 * 邦布查询（绝区零）
 * 命令: #邦布
 */
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

interface BuddyItem {
  id: number;
  name: string;
  rarity: string;
  level: number;
  star: number;
}

interface BuddyData {
  list: BuddyItem[];
}

const formatBuddyList = (data: BuddyData, uid: string): string => {
  const buddies = data.list ?? [];

  if (buddies.length === 0) {
    return `【绝区零·邦布】${uid}\n\n暂无邦布数据`;
  }

  const lines: string[] = [`【绝区零·邦布】${uid}`, '', `共 ${buddies.length} 只邦布`, ''];

  const sorted = [...buddies].sort((a, b) => b.level - a.level || b.star - a.star);

  sorted.forEach(b => {
    lines.push(`${b.rarity} ${b.name} Lv.${b.level} ★${b.star}`);
  });

  return lines.join('\n');
};

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

  const md = Format.createMarkdown();

  if (!result.success) {
    md.addText(`[邦布] ${result.message}`);
  } else {
    md.addText(formatBuddyList(result.data as BuddyData, result.uid ?? ''));
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
