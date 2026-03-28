import { BG_IMAGES, ELEMENT_ICONS, REGION_ICONS, UI_ICONS } from '@src/assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';
import { formatDate, getTheme } from './shared.js';

// ─── 类型定义 ────────────────────────────────────────

export interface GsExploreData {
  game: 'gs';
  uid: string;
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
  }>;
}

export interface SrExploreData {
  game: 'sr';
  uid: string;
  stats: {
    active_days: number;
    avatar_num: number;
    achievement_num: number;
    chest_num: number;
    abyss_process: string;
  };
}

export interface ZzzExploreData {
  game: 'zzz';
  uid: string;
  stats: {
    active_days: number;
    avatar_num: number;
    buddy_num: number;
    achievement_count: number;
    cur_period_zone_layer_count: number;
    world_level_name: string;
  };
}

export type RoleExploreData = GsExploreData | SrExploreData | ZzzExploreData;

export interface RoleExploreCardProps {
  data: RoleExploreData;
}

// ─── 样式 ────────────────────────────────────────────

const GAME_LABELS: Record<string, { name: string; icon: string; color: string }> = {
  gs: { name: '原神', icon: BG_IMAGES.genshinLogo, color: '#8b6d3f' },
  sr: { name: '星穹铁道', icon: UI_ICONS.role, color: '#5c6bc0' },
  zzz: { name: '绝区零', icon: UI_ICONS.role, color: '#e65100' }
};

const OCULUS_NAMES: Array<{ key: string; label: string; element: string }> = [
  { key: 'anemoculus_number', label: '风神瞳', element: '风' },
  { key: 'geoculus_number', label: '岩神瞳', element: '岩' },
  { key: 'electroculus_number', label: '雷神瞳', element: '雷' },
  { key: 'dendroculus_number', label: '草神瞳', element: '草' },
  { key: 'hydroculus_number', label: '水神瞳', element: '水' },
  { key: 'pyroculus_number', label: '火神瞳', element: '火' }
];

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
  section: {
    marginBottom: '12px'
  },
  sectionTitle: {
    fontSize: '13px',
    color: '#9e8e7e',
    borderBottom: '1px solid #f0ede8',
    paddingBottom: '6px',
    marginBottom: '8px'
  },
  statGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const
  },
  statItem: {
    width: '50%',
    padding: '6px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    color: '#6b5e4f',
    fontSize: '13px'
  },
  statValue: {
    fontWeight: 'bold' as const,
    fontSize: '14px',
    color: '#1e1f20',
    paddingRight: '12px'
  },
  chestGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0'
  },
  exploreRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0'
  },
  progressBg: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#f0ede8',
    marginTop: '2px',
    marginBottom: '4px'
  }
};

function StatPair({ label, value, icon }: { label: string; value: string | number; icon?: string }) {
  return (
    <div style={styles.statItem}>
      <span style={{ ...styles.statLabel, display: 'flex', alignItems: 'center', gap: '4px' }}>
        {icon && <img src={icon} style={{ width: '16px', height: '16px' }} />}
        {label}
      </span>
      <span style={styles.statValue}>{value}</span>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div style={styles.progressBg}>
      <div style={{ width: `${pct}%`, height: '6px', borderRadius: '3px', background: color }} />
    </div>
  );
}

// ─── 原神 ────────────────────────────────────────────

function GsContent({ data }: { data: GsExploreData }) {
  const s = data.stats;
  const totalChest = s.luxurious_chest_number + s.precious_chest_number + s.exquisite_chest_number + s.common_chest_number + s.magic_chest_number;

  return (
    <>
      <div style={styles.section}>
        <div style={styles.statGrid}>
          <StatPair label='成就' value={s.achievement_number} />
          <StatPair label='角色数' value={s.avatar_number} />
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>🎁 宝箱 · 共 {totalChest}</div>
        <div style={styles.chestGrid}>
          <StatPair label='华丽' value={s.luxurious_chest_number} />
          <StatPair label='珍贵' value={s.precious_chest_number} />
          <StatPair label='精致' value={s.exquisite_chest_number} />
          <StatPair label='普通' value={s.common_chest_number} />
          <StatPair label='奇馈' value={s.magic_chest_number} />
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>✨ 神瞳</div>
        <div style={styles.statGrid}>
          {OCULUS_NAMES.map((o, i) => {
            const val = (s as unknown as Record<string, number>)[o.key] ?? 0;
            const elemIcon = ELEMENT_ICONS[o.element];

            return val > 0 ? <StatPair key={i} label={o.label} value={val} icon={elemIcon} /> : null;
          })}
        </div>
      </div>

      {data.homes && data.homes.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>🏠 尘歌壶</div>
          <div style={styles.statGrid}>
            <StatPair label='等级' value={data.homes[0].level} />
            <StatPair label='仙力' value={data.homes[0].comfort_num} />
            <StatPair label='摆设' value={data.homes[0].item_num} />
          </div>
        </div>
      )}

      {data.world_explorations.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>🗺️ 世界探索</div>
          {[...data.world_explorations]
            .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
            .map((w, i) => {
              const pct = w.exploration_percentage / 10;
              const offerings = w.offerings?.length > 0 ? w.offerings.map(o => `${o.name}Lv.${o.level}`).join(' ') : '';

              return (
                <div key={i}>
                  <div style={styles.exploreRow}>
                    <span style={{ fontSize: '13px', color: '#6b5e4f', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {REGION_ICONS[w.name] && <img src={REGION_ICONS[w.name]} style={{ width: '18px', height: '18px', borderRadius: '3px' }} />}
                      {w.name}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{pct.toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={pct} max={100} color='#8b6d3f' />
                  {offerings && <div style={{ fontSize: '11px', color: '#9e8e7e', marginTop: '-2px', marginBottom: '2px' }}>{offerings}</div>}
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

// ─── 星铁 ────────────────────────────────────────────

function SrContent({ data }: { data: SrExploreData }) {
  const s = data.stats;

  return (
    <div style={styles.statGrid}>
      <StatPair label='活跃天数' value={s.active_days} />
      <StatPair label='角色数' value={s.avatar_num} />
      <StatPair label='成就' value={s.achievement_num} />
      <StatPair label='宝箱' value={s.chest_num} />
      <StatPair label='忘却之庭' value={s.abyss_process} />
    </div>
  );
}

// ─── 绝区零 ──────────────────────────────────────────

function ZzzContent({ data }: { data: ZzzExploreData }) {
  const s = data.stats;

  return (
    <div style={styles.statGrid}>
      <StatPair label='活跃天数' value={s.active_days} />
      <StatPair label='代理人' value={s.avatar_num} />
      <StatPair label='邦布' value={s.buddy_num} />
      <StatPair label='成就' value={s.achievement_count} />
      <StatPair label='式舆防卫战' value={`第${s.cur_period_zone_layer_count}层`} />
      {s.world_level_name && <StatPair label='等级' value={s.world_level_name} />}
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────

export default function RoleExploreCard({ data }: RoleExploreCardProps) {
  const gameInfo = GAME_LABELS[data.game];
  const theme = getTheme(data.game);
  const dateStr = formatDate();

  return (
    <HTML style={{ width: '600px' }}>
      <div style={styles.card}>
        <div style={{ ...styles.header, background: theme.gradient }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={gameInfo.icon} style={{ width: '24px', height: '24px' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.headerText }}>{gameInfo.name} · 探索</span>
          </div>
          <span style={{ fontSize: '13px', color: theme.headerSub }}>UID {data.uid}</span>
        </div>

        <div style={styles.body}>
          {data.game === 'gs' && <GsContent data={data} />}
          {data.game === 'sr' && <SrContent data={data} />}
          {data.game === 'zzz' && <ZzzContent data={data} />}
        </div>

        <div style={{ textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' }}>{dateStr}</div>
      </div>
    </HTML>
  );
}
