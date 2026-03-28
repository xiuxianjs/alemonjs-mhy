/**
 * 幻想真境剧诗
 * 命令: #剧诗 / #幻想真境剧诗
 */
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

interface CombatRound {
  avatars: Array<{
    avatar_id: number;
    avatar_type: number;
    name: string;
    element: string;
    level: number;
    rarity: number;
  }>;
  choice_cards: Array<{ name: string; desc: string }>;
  buffs: Array<{ name: string; desc: string }>;
  round_id: number;
  is_get_medal: boolean;
}

interface CombatDetail {
  rounds_data: CombatRound[];
  detail_stat: {
    difficulty_id: number;
    max_round_id: number;
    avatar_bonus_num: number;
    rent_cnt: number;
  };
  backup_avatars: Array<{ avatar_id: number; name: string; level: number; rarity: number }>;
}

interface CombatSchedule {
  start_time: number;
  end_time: number;
  schedule_type: number;
  schedule_id: number;
  start_date_time: { year: string; month: string; day: string };
  end_date_time: { year: string; month: string; day: string };
}

interface CombatStat {
  difficulty_id: number;
  max_round_id: number;
  heresy_count: number;
  avatar_bonus_num: number;
  rent_cnt: number;
  coin_num: number;
}

interface RoleCombatData {
  has_data: boolean;
  has_detail_data: boolean;
  data: Array<{
    detail: CombatDetail;
    stat: CombatStat;
    schedule: CombatSchedule;
  }>;
}

const formatCombat = (data: RoleCombatData, uid: string): string => {
  if (!data.has_data || data.data.length === 0) {
    return `【幻想真境剧诗】${uid}\n\n本期暂无挑战数据`;
  }

  if (!data.has_detail_data) {
    return `【幻想真境剧诗】${uid}\n\n数据还没更新，请稍后再试`;
  }

  const current = data.data[0];
  const schedule = current.schedule;
  const stat = current.stat;
  const detail = current.detail;

  const lines: string[] = [
    `【幻想真境剧诗】${uid}`,
    '',
    `周期: ${schedule.start_date_time.month}/${schedule.start_date_time.day} ~ ${schedule.end_date_time.month}/${schedule.end_date_time.day}`,
    `最深幕数: 第${stat.max_round_id}幕  |  异端值: ${stat.heresy_count}`,
    `获取金币: ${stat.coin_num}  |  助战: ${stat.rent_cnt}次`
  ];

  // 各幕详情
  if (detail.rounds_data && detail.rounds_data.length > 0) {
    lines.push('', '--- 各幕阵容 ---');

    detail.rounds_data.forEach(round => {
      const names = round.avatars.map(a => a.name).join(' / ');
      const medal = round.is_get_medal ? ' ✦' : '';

      lines.push(`第${round.round_id}幕${medal}: ${names}`);
    });
  }

  // 候选角色
  if (detail.backup_avatars && detail.backup_avatars.length > 0) {
    lines.push('', '--- 候选角色 ---');

    const backupNames = detail.backup_avatars.map(a => `${a.name}Lv.${a.level}`).join(' / ');

    lines.push(backupNames);
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

  const result = await queryMihoyoApi({
    userId,
    game: 'gs',
    api: 'roleCombat',
    query: { need_detail: true }
  });

  const md = Format.createMarkdown();

  if (!result.success) {
    md.addText(`[剧诗] ${result.message}`);
  } else {
    md.addText(formatCombat(result.data as RoleCombatData, result.uid ?? ''));
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
