import { BG_IMAGES, UI_ICONS } from '@src/assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';

// ─── 类型定义 ────────────────────────────────────────

export interface GsDailyNoteData {
  game: 'gs';
  uid: string;
  current_resin: number;
  max_resin: number;
  resin_recovery_time: string;
  finished_task_num: number;
  total_task_num: number;
  current_expedition_num: number;
  max_expedition_num: number;
  expeditions: Array<{ status: string; remained_time: string }>;
  current_home_coin: number;
  max_home_coin: number;
  home_coin_recovery_time: string;
  transformer?: {
    obtained: boolean;
    recovery_time: { reached: boolean; Day: number; Hour: number; Minute: number };
  };
}

export interface SrDailyNoteData {
  game: 'sr';
  uid: string;
  current_stamina: number;
  max_stamina: number;
  stamina_recover_time: number;
  current_reserve_stamina: number;
  current_train_score: number;
  max_train_score: number;
  accepted_expedition_num: number;
  total_expedition_num: number;
  expeditions: Array<{ status: string; remaining_time: number; name: string }>;
}

export interface ZzzDailyNoteData {
  game: 'zzz';
  uid: string;
  energy: { progress: { max: number; current: number }; restore: number };
  vitality: { max: number; current: number };
  card_sign: string;
}

export type DailyNoteData = GsDailyNoteData | SrDailyNoteData | ZzzDailyNoteData;

export interface DailyNoteCardProps {
  data: DailyNoteData;
}

// ─── 工具函数 ────────────────────────────────────────

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const PERCENT_100 = 100;

const formatTime = (seconds: number): string => {
  if (seconds <= 0) {
    return '已满';
  }
  if (seconds >= SECONDS_PER_DAY) {
    const d = Math.floor(seconds / SECONDS_PER_DAY);
    const h = Math.floor((seconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);

    return `${d}天${h}小时`;
  }
  const h = Math.floor(seconds / SECONDS_PER_HOUR);
  const m = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

  return h > 0 ? `${h}小时${m}分` : `${m}分钟`;
};

const formatRecoverAt = (seconds: number): string => {
  if (seconds <= 0) {
    return '';
  }
  const target = new Date(Date.now() + seconds * 1000);
  const now = new Date();
  const isToday = target.getDate() === now.getDate();
  const prefix = isToday ? '今天' : '明天';
  const hh = String(target.getHours()).padStart(2, '0');
  const mm = String(target.getMinutes()).padStart(2, '0');

  return `${prefix} ${hh}:${mm}`;
};

const percent = (cur: number, max: number): number => (max > 0 ? (cur / max) * PERCENT_100 : 0);

const GAME_LABELS: Record<string, { name: string; color: string; icon: string }> = {
  gs: { name: '原神', color: '#8b6d3f', icon: BG_IMAGES.genshinLogo },
  sr: { name: '星穹铁道', color: '#5c6bc0', icon: UI_ICONS.role },
  zzz: { name: '绝区零', color: '#e65100', icon: UI_ICONS.role }
};

// ─── 子组件 ──────────────────────────────────────────

const styles = {
  card: {
    padding: '24px',
    background: 'linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)',
    fontFamily: '"tttgbnumber", system-ui, sans-serif',
    fontSize: '14px',
    color: '#1e1f20'
  },
  header: {
    background: 'linear-gradient(135deg, #e8d5b0, #d3bc8e)',
    borderRadius: '14px 14px 0 0',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  body: {
    background: '#fff',
    borderRadius: '0 0 14px 14px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f0ede8'
  },
  rowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b5e4f',
    fontSize: '14px'
  },
  value: {
    fontWeight: 'bold' as const,
    fontSize: '16px',
    color: '#1e1f20'
  },
  valueFull: {
    fontWeight: 'bold' as const,
    fontSize: '16px',
    color: '#c62828'
  },
  sub: {
    fontSize: '12px',
    color: '#9e8e7e',
    marginTop: '2px'
  },
  progressBg: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#f0ede8',
    marginTop: '8px'
  }
};

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = percent(value, max);

  return (
    <div style={styles.progressBg}>
      <div
        style={{
          width: `${pct}%`,
          height: '8px',
          borderRadius: '4px',
          background: `linear-gradient(90deg, ${color}, ${color}cc)`
        }}
      />
    </div>
  );
}

function Row({ icon, label, value, sub, isFull, isLast }: { icon: string; label: string; value: string; sub?: string; isFull?: boolean; isLast?: boolean }) {
  const isUrl = icon.startsWith('/') || icon.startsWith('http');

  return (
    <div style={isLast ? styles.rowLast : styles.row}>
      <div style={styles.label}>
        {isUrl ? <img src={icon} style={{ width: '20px', height: '20px' }} /> : <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={isFull ? styles.valueFull : styles.value}>{value}</div>
        {sub && <div style={styles.sub}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── 原神卡片 ────────────────────────────────────────

function GsCard({ data }: { data: GsDailyNoteData }) {
  const resinSec = Number(data.resin_recovery_time);
  const coinSec = Number(data.home_coin_recovery_time);
  const resinFull = data.current_resin >= data.max_resin;
  const coinFull = data.current_home_coin >= data.max_home_coin;

  const expDone = data.expeditions.filter(e => Number(e.remained_time) <= 0).length;
  const expTotal = data.expeditions.length;

  let transformerText = '';

  if (data.transformer) {
    if (!data.transformer.obtained) {
      transformerText = '尚未获得';
    } else if (data.transformer.recovery_time.reached) {
      transformerText = '可使用';
    } else {
      const t = data.transformer.recovery_time;
      const parts: string[] = [];

      if (t.Day > 0) {
        parts.push(`${t.Day}天`);
      }
      if (t.Hour > 0) {
        parts.push(`${t.Hour}时`);
      }
      if (t.Minute > 0) {
        parts.push(`${t.Minute}分`);
      }
      transformerText = parts.join('') || '冷却中';
    }
  }

  return (
    <>
      <Row
        icon={UI_ICONS.resin}
        label='原粹树脂'
        value={`${data.current_resin} / ${data.max_resin}`}
        sub={resinFull ? '已满' : `${formatTime(resinSec)} · ${formatRecoverAt(resinSec)}`}
        isFull={resinFull}
      />
      <ProgressBar value={data.current_resin} max={data.max_resin} color='#8b6d3f' />

      <div style={{ height: '8px' }} />

      <Row
        icon={UI_ICONS.checkin}
        label='每日委托'
        value={`${data.finished_task_num} / ${data.total_task_num}`}
        isFull={data.finished_task_num >= data.total_task_num}
      />
      <Row
        icon={UI_ICONS.primogem}
        label='洞天宝钱'
        value={`${data.current_home_coin} / ${data.max_home_coin}`}
        sub={coinFull ? '已满' : formatTime(coinSec)}
        isFull={coinFull}
      />
      <Row icon='🧭' label='探索派遣' value={`${expDone} / ${expTotal} 完成`} sub={expDone < expTotal ? '进行中' : '全部完成'} isFull={expDone >= expTotal} />
      {data.transformer && <Row icon='🔮' label='参量质变仪' value={transformerText} isFull={data.transformer.recovery_time?.reached} isLast />}
    </>
  );
}

// ─── 星铁卡片 ────────────────────────────────────────

function SrCard({ data }: { data: SrDailyNoteData }) {
  const staminaFull = data.current_stamina >= data.max_stamina;
  const expDone = data.expeditions.filter(e => e.remaining_time <= 0).length;

  return (
    <>
      <Row
        icon='⚡'
        label='开拓力'
        value={`${data.current_stamina} / ${data.max_stamina}`}
        sub={staminaFull ? '已满' : `${formatTime(data.stamina_recover_time)} · ${formatRecoverAt(data.stamina_recover_time)}`}
        isFull={staminaFull}
      />
      <ProgressBar value={data.current_stamina} max={data.max_stamina} color='#5c6bc0' />

      <div style={{ height: '8px' }} />

      <Row icon='🔋' label='后备开拓力' value={`${data.current_reserve_stamina}`} />
      <Row
        icon='📋'
        label='每日实训'
        value={`${data.current_train_score} / ${data.max_train_score}`}
        isFull={data.current_train_score >= data.max_train_score}
      />
      <Row
        icon='🧭'
        label='委托派遣'
        value={`${expDone} / ${data.expeditions.length} 完成`}
        sub={expDone < data.expeditions.length ? '进行中' : '全部完成'}
        isLast
      />
    </>
  );
}

// ─── 绝区零卡片 ──────────────────────────────────────

function ZzzCard({ data }: { data: ZzzDailyNoteData }) {
  const cur = data.energy.progress.current;
  const max = data.energy.progress.max;
  const full = cur >= max;

  return (
    <>
      <Row
        icon='🔋'
        label='电量'
        value={`${cur} / ${max}`}
        sub={full ? '已满' : `${formatTime(data.energy.restore)} · ${formatRecoverAt(data.energy.restore)}`}
        isFull={full}
      />
      <ProgressBar value={cur} max={max} color='#e65100' />

      <div style={{ height: '8px' }} />

      <Row icon='🔥' label='活跃度' value={`${data.vitality.current} / ${data.vitality.max}`} isFull={data.vitality.current >= data.vitality.max} isLast />
    </>
  );
}

// ─── 主组件 ──────────────────────────────────────────

export default function DailyNoteCard({ data }: DailyNoteCardProps) {
  const gameInfo = GAME_LABELS[data.game];
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <HTML style={{ width: '480px' }}>
      <div style={styles.card}>
        {/* 标题 */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={gameInfo.icon} style={{ width: '24px', height: '24px' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' }}>{gameInfo.name} · 实时便笺</span>
          </div>
          <span style={{ fontSize: '13px', color: '#7a6b57' }}>UID {data.uid}</span>
        </div>

        {/* 内容 */}
        <div style={styles.body}>
          {data.game === 'gs' && <GsCard data={data} />}
          {data.game === 'sr' && <SrCard data={data} />}
          {data.game === 'zzz' && <ZzzCard data={data} />}
        </div>

        {/* 底部 */}
        <div
          style={{
            textAlign: 'right',
            padding: '8px 4px 0',
            fontSize: '11px',
            color: '#b0a89c'
          }}
        >
          {dateStr}
        </div>
      </div>
    </HTML>
  );
}
