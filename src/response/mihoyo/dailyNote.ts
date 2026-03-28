/**
 * 体力查询
 * 命令: #体力 / #原神体力 / #星铁体力 / #绝区零体力 / #树脂 / #查询体力
 */
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) {
    return '已满';
  }

  const h = Math.floor(seconds / SECONDS_PER_HOUR);
  const m = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

  if (h > 0) {
    return `${h}小时${m}分`;
  }

  return `${m}分钟`;
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

// ─── 原神体力 ────────────────────────────────────────

interface GsDailyNote {
  current_resin: number;
  max_resin: number;
  resin_recovery_time: string;
  finished_task_num: number;
  total_task_num: number;
  current_expedition_num: number;
  max_expedition_num: number;
  expeditions: Array<{
    status: string;
    remained_time: string;
  }>;
  current_home_coin: number;
  max_home_coin: number;
  home_coin_recovery_time: string;
  transformer?: {
    obtained: boolean;
    recovery_time: { reached: boolean; Day: number; Hour: number; Minute: number };
  };
}

const formatGsNote = (data: GsDailyNote, uid: string): string => {
  const lines: string[] = [
    `【原神】${uid}`,
    '',
    `树脂: ${data.current_resin}/${data.max_resin}` +
      (Number(data.resin_recovery_time) > 0 ? ` (${formatCountdown(Number(data.resin_recovery_time))})` : ' (已满)'),
    `每日委托: ${data.finished_task_num}/${data.total_task_num}`,
    `洞天宝钱: ${data.current_home_coin}/${data.max_home_coin}` +
      (Number(data.home_coin_recovery_time) > 0 ? ` (${formatCountdown(Number(data.home_coin_recovery_time))})` : '')
  ];

  // 探索派遣
  if (data.expeditions.length > 0) {
    lines.push(`探索派遣: ${data.current_expedition_num}/${data.max_expedition_num}`);

    data.expeditions.forEach((exp, i) => {
      const remain = Number(exp.remained_time);
      const status = remain <= 0 ? '已完成' : formatCountdown(remain);

      lines.push(`  ${i + 1}. ${status}`);
    });
  }

  // 参量质变仪
  if (data.transformer?.obtained) {
    const t = data.transformer.recovery_time;

    if (t.reached) {
      lines.push('参量质变仪: 可使用');
    } else {
      const parts: string[] = [];

      if (t.Day > 0) {
        parts.push(`${t.Day}天`);
      }

      if (t.Hour > 0) {
        parts.push(`${t.Hour}小时`);
      }

      if (t.Minute > 0) {
        parts.push(`${t.Minute}分`);
      }

      lines.push(`参量质变仪: ${parts.join('')}`);
    }
  }

  return lines.join('\n');
};

// ─── 星铁体力 ────────────────────────────────────────

interface SrDailyNote {
  current_stamina: number;
  max_stamina: number;
  stamina_recover_time: number;
  current_reserve_stamina: number;
  current_train_score: number;
  max_train_score: number;
  accepted_expedition_num: number;
  total_expedition_num: number;
  expeditions: Array<{
    status: string;
    remaining_time: number;
    name: string;
  }>;
}

const formatSrNote = (data: SrDailyNote, uid: string): string => {
  const lines: string[] = [
    `【星穹铁道】${uid}`,
    '',
    `开拓力: ${data.current_stamina}/${data.max_stamina}` + (data.stamina_recover_time > 0 ? ` (${formatCountdown(data.stamina_recover_time)})` : ' (已满)'),
    `后备开拓力: ${data.current_reserve_stamina}`,
    `每日实训: ${data.current_train_score}/${data.max_train_score}`
  ];

  if (data.expeditions.length > 0) {
    lines.push(`委托: ${data.accepted_expedition_num}/${data.total_expedition_num}`);

    data.expeditions.forEach((exp, i) => {
      const status = exp.remaining_time <= 0 ? '已完成' : formatCountdown(exp.remaining_time);

      lines.push(`  ${i + 1}. ${status}`);
    });
  }

  return lines.join('\n');
};

// ─── 绝区零体力 ──────────────────────────────────────

interface ZzzDailyNote {
  energy: {
    progress: { max: number; current: number };
    restore: number;
  };
  vitality: {
    max: number;
    current: number;
  };
  card_sign: string;
}

const formatZzzNote = (data: ZzzDailyNote, uid: string): string => {
  const lines: string[] = [
    `【绝区零】${uid}`,
    '',
    `电量: ${data.energy.progress.current}/${data.energy.progress.max}` + (data.energy.restore > 0 ? ` (${formatCountdown(data.energy.restore)})` : ' (已满)'),
    `活跃度: ${data.vitality.current}/${data.vitality.max}`
  ];

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
    api: 'dailyNote'
  });

  const md = Format.createMarkdown();

  if (!result.success) {
    md.addText(`[${GAME_NAMES[game]}体力] ${result.message}`);
  } else {
    const uid = result.uid ?? '';

    switch (game) {
      case 'gs':
        md.addText(formatGsNote(result.data as GsDailyNote, uid));
        break;
      case 'sr':
        md.addText(formatSrNote(result.data as SrDailyNote, uid));
        break;
      case 'zzz':
        md.addText(formatZzzNote(result.data as ZzzDailyNote, uid));
        break;
    }
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
