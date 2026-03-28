/**
 * 探索 / 宝箱 / 成就 查询
 * 命令: #探索 / #宝箱 / #成就 / #尘歌壶
 */
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const resolveGame = (text: string): MihoyoGame => {
  if (text.includes('星铁')) {
    return 'sr';
  }

  if (text.includes('绝区零')) {
    return 'zzz';
  }

  return 'gs';
};

// ─── 原神探索 ────────────────────────────────────────

interface GsExploreData {
  stats: {
    achievement_number: number;
    avatar_number: number;
    luxurious_chest_number: number;
    precious_chest_number: number;
    exquisite_chest_number: number;
    common_chest_number: number;
    magic_chest_number: number;
    anemoculus_number: number;
    geoculus_number: number;
    electroculus_number: number;
    dendroculus_number: number;
    hydroculus_number: number;
    pyroculus_number: number;
  };
  homes: Array<{
    level: number;
    comfort_num: number;
    item_num: number;
    name: string;
  }>;
  world_explorations: Array<{
    name: string;
    exploration_percentage: number;
    level: number;
    offerings: Array<{ name: string; level: number }>;
    area_exploration_list: Array<{ name: string; exploration_percentage: number }>;
  }>;
}

const formatGsExplore = (data: GsExploreData, uid: string): string => {
  const s = data.stats;
  const totalChest = s.luxurious_chest_number + s.precious_chest_number + s.exquisite_chest_number + s.common_chest_number + s.magic_chest_number;

  const lines: string[] = [
    `【原神·探索】${uid}`,
    '',
    `成就: ${s.achievement_number}  |  角色数: ${s.avatar_number}`,
    '',
    '--- 宝箱 ---',
    `华丽: ${s.luxurious_chest_number}  |  珍贵: ${s.precious_chest_number}`,
    `精致: ${s.exquisite_chest_number}  |  普通: ${s.common_chest_number}`,
    `奇馈: ${s.magic_chest_number}  |  总计: ${totalChest}`,
    '',
    '--- 神瞳 ---',
    `风: ${s.anemoculus_number}  岩: ${s.geoculus_number}  雷: ${s.electroculus_number}`,
    `草: ${s.dendroculus_number}  水: ${s.hydroculus_number ?? 0}  火: ${s.pyroculus_number ?? 0}`
  ];

  // 尘歌壶
  if (data.homes && data.homes.length > 0) {
    const home = data.homes[0];

    lines.push('', '--- 尘歌壶 ---');
    lines.push(`等级: ${home.level}  |  仙力: ${home.comfort_num}  |  摆设: ${home.item_num}`);
  }

  // 世界探索
  if (data.world_explorations.length > 0) {
    lines.push('', '--- 世界探索 ---');

    data.world_explorations
      .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
      .forEach(w => {
        const pct = (w.exploration_percentage / 10).toFixed(1);
        let extra = '';

        if (w.offerings && w.offerings.length > 0) {
          extra = ` [${w.offerings.map(o => `${o.name}Lv.${o.level}`).join(' ')}]`;
        }

        lines.push(`${w.name}: ${pct}%${extra}`);
      });
  }

  return lines.join('\n');
};

// ─── 星铁探索 ────────────────────────────────────────

interface SrExploreData {
  stats: {
    active_days: number;
    avatar_num: number;
    achievement_num: number;
    chest_num: number;
    abyss_process: string;
  };
}

const formatSrExplore = (data: SrExploreData, uid: string): string => {
  const s = data.stats;

  return [
    `【星穹铁道·探索】${uid}`,
    '',
    `活跃天数: ${s.active_days}`,
    `角色数量: ${s.avatar_num}`,
    `成就: ${s.achievement_num}`,
    `宝箱: ${s.chest_num}`,
    `忘却之庭: ${s.abyss_process}`
  ].join('\n');
};

// ─── 绝区零探索 ──────────────────────────────────────

interface ZzzExploreData {
  stats: {
    active_days: number;
    avatar_num: number;
    buddy_num: number;
    achievement_count: number;
    cur_period_zone_layer_count: number;
    world_level_name: string;
  };
}

const formatZzzExplore = (data: ZzzExploreData, uid: string): string => {
  const s = data.stats;

  return [
    `【绝区零·探索】${uid}`,
    '',
    `活跃天数: ${s.active_days}`,
    `代理人: ${s.avatar_num}  |  邦布: ${s.buddy_num}`,
    `成就: ${s.achievement_count}`,
    `式舆防卫战: 第${s.cur_period_zone_layer_count}层`,
    s.world_level_name ? `等级: ${s.world_level_name}` : ''
  ]
    .filter(Boolean)
    .join('\n');
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
    md.addText(`[探索] ${result.message}`);
  } else {
    const uid = result.uid ?? '';

    switch (game) {
      case 'gs':
        md.addText(formatGsExplore(result.data as GsExploreData, uid));
        break;
      case 'sr':
        md.addText(formatSrExplore(result.data as SrExploreData, uid));
        break;
      case 'zzz':
        md.addText(formatZzzExplore(result.data as ZzzExploreData, uid));
        break;
    }
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
