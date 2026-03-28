import { UI_ICONS } from '@src/assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';
import { formatDate, getTheme } from './shared.js';

// ─── 类型定义 ────────────────────────────────────────

export interface GsAbyssData {
  game: 'gs';
  uid: string;
  schedule_id: number;
  start_time: string;
  end_time: string;
  total_battle_times: number;
  total_win_times: number;
  max_floor: string;
  total_star: number;
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

export interface SrAbyssData {
  game: 'sr';
  uid: string;
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

export type SpiralAbyssData = GsAbyssData | SrAbyssData;

export interface SpiralAbyssCardProps {
  data: SpiralAbyssData;
}

// ─── 样式 ────────────────────────────────────────────

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
    borderRadius: '12px 12px 0 0',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  body: {
    background: '#fff',
    borderRadius: '0 0 12px 12px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f0ede8'
  },
  label: {
    color: '#6b5e4f',
    fontSize: '13px'
  },
  value: {
    fontWeight: 'bold' as const,
    fontSize: '14px'
  },
  sectionTitle: {
    fontSize: '13px',
    color: '#9e8e7e',
    borderBottom: '1px solid #f0ede8',
    paddingBottom: '6px',
    marginBottom: '8px',
    marginTop: '12px'
  },
  floorRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f8f6f2'
  },
  floorName: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#4a3c2a'
  },
  stars: {
    fontSize: '13px',
    color: '#c6923a'
  },
  noData: {
    textAlign: 'center' as const,
    padding: '20px 0',
    color: '#9e8e7e',
    fontSize: '14px'
  }
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

function StarDisplay({ count, max }: { count: number; max: number }) {
  const filled = '★'.repeat(count);
  const empty = '☆'.repeat(max - count);

  return (
    <span style={styles.stars}>
      {filled}
      {empty}
    </span>
  );
}

// ─── 原神 ────────────────────────────────────────────

function GsContent({ data }: { data: GsAbyssData }) {
  const highFloors = data.floors.filter(f => f.index >= 9);

  return (
    <>
      <StatRow label='最深抵达' value={data.max_floor} />
      <StatRow label='总星数' value={`${data.total_star}★`} />
      <StatRow label='战斗次数' value={`${data.total_win_times} / ${data.total_battle_times}`} />

      {data.damage_rank.length > 0 && <StatRow label='最强一击' value={data.damage_rank[0].value.toLocaleString()} />}
      {data.defeat_rank.length > 0 && <StatRow label='最多击破' value={data.defeat_rank[0].value.toLocaleString()} />}
      {data.take_damage_rank.length > 0 && <StatRow label='最多承伤' value={data.take_damage_rank[0].value.toLocaleString()} />}

      {highFloors.length > 0 && (
        <>
          <div style={styles.sectionTitle}>楼层详情</div>
          {highFloors.map((floor, fi) => (
            <div key={fi}>
              <div style={styles.floorRow}>
                <span style={styles.floorName}>第{floor.index}层</span>
                <StarDisplay count={floor.star} max={floor.max_star} />
              </div>
              {floor.levels.map((level, li) => (
                <div key={li} style={{ padding: '3px 0 3px 16px', fontSize: '12px', color: '#6b5e4f', display: 'flex', justifyContent: 'space-between' }}>
                  <span>第{level.index}间</span>
                  <StarDisplay count={level.star} max={level.max_star} />
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </>
  );
}

// ─── 星铁 ────────────────────────────────────────────

function SrContent({ data }: { data: SrAbyssData }) {
  if (!data.has_data) {
    return <div style={styles.noData}>本期暂无挑战数据</div>;
  }

  return (
    <>
      <StatRow label='最深抵达' value={data.max_floor} />
      <StatRow label='总星数' value={`${data.total_stars}★`} />
      <StatRow label='战斗次数' value={data.total_battles} />

      {data.all_floor_detail.length > 0 && (
        <>
          <div style={styles.sectionTitle}>楼层详情</div>
          {data.all_floor_detail.map((floor, fi) => (
            <div key={fi} style={styles.floorRow}>
              <div>
                <div style={styles.floorName}>{floor.name}</div>
                <div style={{ fontSize: '11px', color: '#9e8e7e' }}>{floor.round_num}轮</div>
              </div>
              <StarDisplay count={floor.star_num} max={3} />
            </div>
          ))}
        </>
      )}
    </>
  );
}

// ─── 主组件 ──────────────────────────────────────────

const TITLES: Record<string, { name: string; icon: string }> = {
  gs: { name: '原神 · 深境螺旋', icon: UI_ICONS.abyss },
  sr: { name: '星穹铁道 · 忘却之庭', icon: UI_ICONS.abyss }
};

export default function SpiralAbyssCard({ data }: SpiralAbyssCardProps) {
  const info = TITLES[data.game];
  const theme = getTheme(data.game);
  const dateStr = formatDate();

  return (
    <HTML style={{ width: '600px' }}>
      <div style={styles.card}>
        <div style={{ ...styles.header, background: theme.gradient }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={info.icon} style={{ width: '24px', height: '24px' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.headerText }}>{info.name}</span>
          </div>
          <span style={{ fontSize: '13px', color: theme.headerSub }}>UID {data.uid}</span>
        </div>

        <div style={styles.body}>
          {data.game === 'gs' && <GsContent data={data} />}
          {data.game === 'sr' && <SrContent data={data} />}
        </div>

        <div style={{ textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' }}>{dateStr}</div>
      </div>
    </HTML>
  );
}
