/**
 * 深渊 / 忘却之庭 / 虚构叙事查询
 * 命令: #深渊 / #上期深渊 / #星铁深渊 / #忘却之庭
 */
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const ABYSS_NAMES: Record<MihoyoGame, string> = {
  gs: '深境螺旋',
  sr: '忘却之庭',
  zzz: '式舆防卫战'
};

const resolveGame = (text: string): MihoyoGame => {
  if (text.includes('星铁') || text.includes('忘却之庭') || text.includes('虚构叙事')) {
    return 'sr';
  }

  return 'gs';
};

// ─── 原神深渊 ────────────────────────────────────────

interface GsAbyssData {
  schedule_id: number;
  start_time: string;
  end_time: string;
  total_battle_times: number;
  total_win_times: number;
  max_floor: string;
  total_star: number;
  reveal_rank: Array<{ avatar_id: number; avatar_icon: string; value: number }>;
  damage_rank: Array<{ avatar_icon: string; value: number }>;
  take_damage_rank: Array<{ avatar_icon: string; value: number }>;
  defeat_rank: Array<{ avatar_icon: string; value: number }>;
  normal_skill_rank: Array<{ avatar_icon: string; value: number }>;
  energy_skill_rank: Array<{ avatar_icon: string; value: number }>;
  floors: Array<{
    index: number;
    star: number;
    max_star: number;
    levels: Array<{
      index: number;
      star: number;
      max_star: number;
      battles: Array<{
        index: number;
        avatars: Array<{ id: number; icon: string; level: number; rarity: number }>;
      }>;
    }>;
  }>;
}

const formatGsAbyss = (data: GsAbyssData, uid: string): string => {
  const lines: string[] = [
    `【原神 · 深境螺旋】${uid}`,
    '',
    `最深抵达: ${data.max_floor}  |  总星数: ${data.total_star}★`,
    `战斗次数: ${data.total_battle_times}  |  胜利: ${data.total_win_times}`
  ];

  // 最强一击
  if (data.damage_rank.length > 0) {
    lines.push(`最强一击: ${data.damage_rank[0].value}`);
  }

  if (data.take_damage_rank.length > 0) {
    lines.push(`最多承伤: ${data.take_damage_rank[0].value}`);
  }

  if (data.defeat_rank.length > 0) {
    lines.push(`最多击破: ${data.defeat_rank[0].value}`);
  }

  // 楼层摘要
  const highFloors = data.floors.filter(f => f.index >= 9);

  if (highFloors.length > 0) {
    lines.push('', '--- 楼层 ---');

    highFloors.forEach(floor => {
      lines.push(`第${floor.index}层: ${floor.star}/${floor.max_star}★`);
    });
  }

  return lines.join('\n');
};

// ─── 星铁深渊 ────────────────────────────────────────

interface SrAbyssData {
  schedule_id: number;
  begin_time: { year: string; month: string; day: string };
  end_time: { year: string; month: string; day: string };
  total_stars: number;
  max_floor: string;
  total_battles: number;
  has_data: boolean;
  all_floor_detail: Array<{
    name: string;
    star_num: number;
    round_num: number;
    node_1: { avatars: Array<{ id: number; name: string; level: number; rarity: number }> };
    node_2: { avatars: Array<{ id: number; name: string; level: number; rarity: number }> };
  }>;
}

const formatSrAbyss = (data: SrAbyssData, uid: string): string => {
  if (!data.has_data) {
    return `【星穹铁道 · 忘却之庭】${uid}\n\n本期暂无挑战数据`;
  }

  const lines: string[] = [
    `【星穹铁道 · 忘却之庭】${uid}`,
    '',
    `最深抵达: ${data.max_floor}  |  总星数: ${data.total_stars}★`,
    `战斗次数: ${data.total_battles}`
  ];

  if (data.all_floor_detail.length > 0) {
    lines.push('', '--- 楼层 ---');

    data.all_floor_detail.forEach(floor => {
      lines.push(`${floor.name}: ${floor.star_num}★ (${floor.round_num}轮)`);
    });
  }

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
  const text = e.MessageText ?? '';
  const game = resolveGame(text);

  // ZZZ 暂无深渊接口
  if (game === 'zzz') {
    const md = Format.createMarkdown();

    md.addText('绝区零暂不支持深渊查询');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 上期 / 本期
  const isLast = /上期|往期/.test(text);
  const scheduleType = isLast ? 2 : 1;

  const result = await queryMihoyoApi({
    userId,
    game,
    api: 'spiralAbyss',
    query: { schedule_type: scheduleType }
  });

  const md = Format.createMarkdown();

  if (!result.success) {
    md.addText(`[${ABYSS_NAMES[game]}] ${result.message}`);
  } else {
    const uid = result.uid ?? '';

    if (game === 'gs') {
      md.addText(formatGsAbyss(result.data as GsAbyssData, uid));
    } else {
      md.addText(formatSrAbyss(result.data as SrAbyssData, uid));
    }
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
