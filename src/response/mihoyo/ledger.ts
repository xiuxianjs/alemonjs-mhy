/**
 * 札记 / 原石统计 / 星琼统计
 * 命令: #札记 / #原石 / #星琼 / #原石6月
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
  if (text.includes('星铁') || text.includes('星琼')) {
    return 'sr';
  }

  return 'gs';
};

const MONTH_CN: Record<string, number> = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  十一: 11,
  十二: 12
};

const parseMonth = (text: string): number => {
  const cleaned = text.replace(/[#!！/＃]|原神|星铁|原石|星琼|札记/g, '').trim();

  if (!cleaned) {
    return new Date().getMonth() + 1;
  }

  const monthStr = cleaned.replace(/月$/, '');

  // 数字月份
  const num = Number(monthStr);

  if (!isNaN(num) && num >= 1 && num <= 12) {
    return num;
  }

  // 中文月份
  if (MONTH_CN[monthStr] !== undefined) {
    return MONTH_CN[monthStr];
  }

  return new Date().getMonth() + 1;
};

const validateMonth = (month: number): boolean => {
  const now = new Date().getMonth() + 1;
  // 最近三个月（跨年处理）
  const valid = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].slice(now - 1, now + 2);

  return valid.includes(month);
};

const formatBigNum = (num: number): string => {
  if (num > 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }

  return String(num);
};

// ─── 原神札记 ────────────────────────────────────────

interface GsLedgerData {
  data_month: number;
  month_data: {
    current_primogems: number;
    current_mora: number;
    last_primogems: number;
    last_mora: number;
    primogem_rate: number;
    mora_rate: number;
    group_by: Array<{
      action_id: number;
      action_name: string;
      num: number;
      percent: number;
    }>;
  };
  day_data: {
    current_primogems: number;
    current_mora: number;
  };
}

const formatGsLedger = (data: GsLedgerData, uid: string): string => {
  const m = data.month_data;
  const d = data.day_data;
  const pulls = Math.floor(m.current_primogems / 160);

  const lines: string[] = [
    `【原神·札记】${uid}`,
    `${data.data_month}月`,
    '',
    `本月原石: ${formatBigNum(m.current_primogems)} (≈${pulls}抽)`,
    `本月摩拉: ${formatBigNum(m.current_mora)}`,
    `今日原石: ${formatBigNum(d.current_primogems)}  |  今日摩拉: ${formatBigNum(d.current_mora)}`,
    '',
    `上月原石: ${formatBigNum(m.last_primogems)}  环比: ${m.primogem_rate}%`,
    `上月摩拉: ${formatBigNum(m.last_mora)}  环比: ${m.mora_rate}%`
  ];

  if (m.group_by && m.group_by.length > 0) {
    lines.push('', '--- 来源分布 ---');

    m.group_by.forEach(g => {
      lines.push(`${g.action_name}: ${formatBigNum(g.num)} (${g.percent}%)`);
    });
  }

  return lines.join('\n');
};

// ─── 星铁札记 ────────────────────────────────────────

interface SrLedgerData {
  data_month: string;
  month_data: {
    current_hcoin: number;
    current_rails_pass: number;
    last_hcoin: number;
    last_rails_pass: number;
    hcoin_rate: number;
    rails_rate: number;
    group_by: Array<{
      action: string;
      action_name: string;
      num: number;
      percent: number;
    }>;
  };
  day_data: {
    current_hcoin: number;
    current_rails_pass: number;
  };
}

const formatSrLedger = (data: SrLedgerData, uid: string): string => {
  const m = data.month_data;
  const d = data.day_data;
  const pulls = Math.floor(m.current_hcoin / 160);

  const lines: string[] = [
    `【星穹铁道·开拓月历】${uid}`,
    `${data.data_month}`,
    '',
    `本月星琼: ${formatBigNum(m.current_hcoin)} (≈${pulls}抽)`,
    `本月通票: ${formatBigNum(m.current_rails_pass)}`,
    `今日星琼: ${formatBigNum(d.current_hcoin)}  |  今日通票: ${formatBigNum(d.current_rails_pass)}`,
    '',
    `上月星琼: ${formatBigNum(m.last_hcoin)}  环比: ${m.hcoin_rate}%`,
    `上月通票: ${formatBigNum(m.last_rails_pass)}  环比: ${m.rails_rate}%`
  ];

  if (m.group_by && m.group_by.length > 0) {
    lines.push('', '--- 来源分布 ---');

    m.group_by.forEach(g => {
      const name = g.action_name.length > 4 ? g.action_name.slice(0, 4) : g.action_name;

      lines.push(`${name}: ${formatBigNum(g.num)} (${g.percent}%)`);
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

  if (game === 'zzz') {
    const md = Format.createMarkdown();

    md.addText('绝区零暂不支持札记查询');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const month = parseMonth(text);

  if (!validateMonth(month)) {
    const md = Format.createMarkdown();

    md.addText('札记仅支持查询最近三个月的数据');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 星铁月份格式为 YYYYMM
  const queryMonth = game === 'sr' ? `${new Date().getFullYear()}${month < 10 ? '0' : ''}${month}` : String(month);

  const result = await queryMihoyoApi({
    userId,
    game,
    api: 'ys_ledger',
    query: { month: queryMonth },
    cached: false
  });

  const md = Format.createMarkdown();

  if (!result.success) {
    md.addText(`[${GAME_NAMES[game]}札记] ${result.message}`);
  } else {
    const uid = result.uid ?? '';

    if (game === 'gs') {
      md.addText(formatGsLedger(result.data as GsLedgerData, uid));
    } else {
      md.addText(formatSrLedger(result.data as SrLedgerData, uid));
    }
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
