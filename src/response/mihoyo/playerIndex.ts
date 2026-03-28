/**
 * 角色面板查询
 * 命令: #角色 / #原神角色 / #星铁角色 / #绝区零角色
 */
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

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

// ─── 原神角色 ────────────────────────────────────────

interface GsIndexData {
  stats: {
    active_day_number: number;
    achievement_number: number;
    anemoculus_number: number;
    geoculus_number: number;
    electroculus_number: number;
    dendroculus_number: number;
    avatar_number: number;
    spiral_abyss: string;
    luxurious_chest_number: number;
    precious_chest_number: number;
    exquisite_chest_number: number;
    common_chest_number: number;
    magic_chest_number: number;
  };
  avatars: Array<{
    id: number;
    name: string;
    level: number;
    rarity: number;
    fetter: number;
    element: string;
    actived_constellation_num: number;
  }>;
  world_explorations: Array<{
    name: string;
    exploration_percentage: number;
    level: number;
  }>;
}

const formatGsIndex = (data: GsIndexData, uid: string): string => {
  const s = data.stats;
  const lines: string[] = [
    `【原神】${uid}`,
    '',
    `活跃天数: ${s.active_day_number}  |  成就: ${s.achievement_number}`,
    `角色数量: ${s.avatar_number}  |  深渊: ${s.spiral_abyss}`,
    `风神瞳: ${s.anemoculus_number}  |  岩神瞳: ${s.geoculus_number}`,
    `雷神瞳: ${s.electroculus_number}  |  草神瞳: ${s.dendroculus_number}`,
    `华丽宝箱: ${s.luxurious_chest_number}  |  珍贵宝箱: ${s.precious_chest_number}`,
    `精致宝箱: ${s.exquisite_chest_number}  |  普通宝箱: ${s.common_chest_number}`
  ];

  // 世界探索
  if (data.world_explorations.length > 0) {
    lines.push('', '--- 世界探索 ---');

    data.world_explorations
      .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
      .forEach(w => {
        const pct = (w.exploration_percentage / 10).toFixed(1);

        lines.push(`${w.name}: ${pct}%`);
      });
  }

  // 角色列表（前10个最高等级）
  if (data.avatars.length > 0) {
    lines.push('', '--- 角色 ---');

    const sorted = [...data.avatars].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
    const top = sorted.slice(0, 10);

    top.forEach(a => {
      lines.push(`${a.name} Lv.${a.level} ★${a.rarity} 命座${a.actived_constellation_num} 好感${a.fetter}`);
    });

    if (sorted.length > 10) {
      lines.push(`... 共${sorted.length}个角色`);
    }
  }

  return lines.join('\n');
};

// ─── 星铁角色 ────────────────────────────────────────

interface SrIndexData {
  stats: {
    active_days: number;
    avatar_num: number;
    achievement_num: number;
    chest_num: number;
    abyss_process: string;
  };
  avatar_list: Array<{
    id: number;
    name: string;
    level: number;
    rarity: number;
    rank: number;
    element: string;
  }>;
}

const formatSrIndex = (data: SrIndexData, uid: string): string => {
  const s = data.stats;
  const lines: string[] = [
    `【星穹铁道】${uid}`,
    '',
    `活跃天数: ${s.active_days}  |  成就: ${s.achievement_num}`,
    `角色数量: ${s.avatar_num}  |  宝箱: ${s.chest_num}`,
    `忘却之庭: ${s.abyss_process}`
  ];

  if (data.avatar_list.length > 0) {
    lines.push('', '--- 角色 ---');

    const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
    const top = sorted.slice(0, 10);

    top.forEach(a => {
      lines.push(`${a.name} Lv.${a.level} ★${a.rarity} 星魂${a.rank}`);
    });

    if (sorted.length > 10) {
      lines.push(`... 共${sorted.length}个角色`);
    }
  }

  return lines.join('\n');
};

// ─── 绝区零角色 ──────────────────────────────────────

interface ZzzIndexData {
  stats: {
    active_days: number;
    avatar_num: number;
    buddy_num: number;
    achievement_count: number;
    cur_period_zone_layer_count: number;
  };
  avatar_list: Array<{
    id: number;
    full_name: string;
    level: number;
    rarity: string;
    rank: number;
    element_type: number;
  }>;
}

const formatZzzIndex = (data: ZzzIndexData, uid: string): string => {
  const s = data.stats;
  const lines: string[] = [
    `【绝区零】${uid}`,
    '',
    `活跃天数: ${s.active_days}  |  成就: ${s.achievement_count}`,
    `代理人: ${s.avatar_num}  |  邦布: ${s.buddy_num}`,
    `式舆防卫战: 第${s.cur_period_zone_layer_count}层`
  ];

  if (data.avatar_list.length > 0) {
    lines.push('', '--- 代理人 ---');

    const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level);
    const top = sorted.slice(0, 10);

    top.forEach(a => {
      lines.push(`${a.full_name} Lv.${a.level} ${a.rarity} 影画${a.rank}`);
    });

    if (sorted.length > 10) {
      lines.push(`... 共${sorted.length}个代理人`);
    }
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

  const result = await queryMihoyoApi({
    userId,
    game,
    api: 'index'
  });

  const md = Format.createMarkdown();

  if (!result.success) {
    md.addText(`[${GAME_NAMES[game]}角色] ${result.message}`);
  } else {
    const uid = result.uid ?? '';

    switch (game) {
      case 'gs':
        md.addText(formatGsIndex(result.data as GsIndexData, uid));
        break;
      case 'sr':
        md.addText(formatSrIndex(result.data as SrIndexData, uid));
        break;
      case 'zzz':
        md.addText(formatZzzIndex(result.data as ZzzIndexData, uid));
        break;
    }
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
