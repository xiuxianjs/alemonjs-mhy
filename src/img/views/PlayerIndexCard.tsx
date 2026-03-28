import { BG_IMAGES, ELEMENT_ICONS, UI_ICONS } from '@src/assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';

// ─── 类型定义 ────────────────────────────────────────

export interface GsIndexData {
  game: 'gs';
  uid: string;
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

export interface SrIndexData {
  game: 'sr';
  uid: string;
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

export interface ZzzIndexData {
  game: 'zzz';
  uid: string;
  stats: {
    active_days: number;
    avatar_num: number;
    buddy_num: number;
    achievement_count: number;
    cur_period_zone_layer_count: number;
  };
  avatar_list: Array<{
    id: number;
    name_mi18n: string;
    full_name_mi18n: string;
    level: number;
    rarity: string;
    rank: number;
    element_type: number;
    camp_name_mi18n: string;
  }>;
}

export type PlayerIndexData = GsIndexData | SrIndexData | ZzzIndexData;

export interface PlayerIndexCardProps {
  data: PlayerIndexData;
}

// ─── 样式 ────────────────────────────────────────────

const RARITY_COLORS: Record<number, string> = {
  5: '#c6923a',
  4: '#a256e1',
  3: '#5180cb'
};

const GAME_LABELS: Record<string, { name: string; color: string; icon: string }> = {
  gs: { name: '原神', color: '#8b6d3f', icon: BG_IMAGES.genshinLogo },
  sr: { name: '星穹铁道', color: '#5c6bc0', icon: UI_ICONS.role },
  zzz: { name: '绝区零', color: '#e65100', icon: UI_ICONS.role }
};

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
    flexWrap: 'wrap' as const,
    gap: '0'
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
  avatarRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    borderBottom: '1px solid #f8f6f2'
  },
  avatarName: {
    fontSize: '13px',
    fontWeight: 'bold' as const
  },
  avatarInfo: {
    fontSize: '12px',
    color: '#6b5e4f'
  },
  exploreRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0'
  },
  exploreName: {
    fontSize: '13px',
    color: '#6b5e4f'
  },
  explorePct: {
    fontSize: '13px',
    fontWeight: 'bold' as const
  },
  progressBg: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#f0ede8',
    marginTop: '2px'
  }
};

// ─── 子组件 ──────────────────────────────────────────

function StatPair({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.statItem}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div style={styles.progressBg}>
      <div
        style={{
          width: `${Math.min(pct, 100)}%`,
          height: '6px',
          borderRadius: '3px',
          background: color
        }}
      />
    </div>
  );
}

// ─── 原神 ────────────────────────────────────────────

function GsContent({ data }: { data: GsIndexData }) {
  const s = data.stats;
  const sorted = [...data.avatars].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
  const top = sorted.slice(0, 10);

  return (
    <>
      <div style={styles.section}>
        <div style={styles.statGrid}>
          <StatPair label='活跃天数' value={s.active_day_number} />
          <StatPair label='成就' value={s.achievement_number} />
          <StatPair label='角色数' value={s.avatar_number} />
          <StatPair label='深渊' value={s.spiral_abyss} />
        </div>
      </div>

      {data.world_explorations.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>世界探索</div>
          {[...data.world_explorations]
            .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
            .slice(0, 8)
            .map((w, i) => {
              const pct = w.exploration_percentage / 10;

              return (
                <div key={i}>
                  <div style={styles.exploreRow}>
                    <span style={styles.exploreName}>{w.name}</span>
                    <span style={styles.explorePct}>{pct.toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={pct} max={100} color='#8b6d3f' />
                </div>
              );
            })}
        </div>
      )}

      {top.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>角色 (Top {top.length})</div>
          {top.map((a, i) => (
            <div key={i} style={styles.avatarRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {ELEMENT_ICONS[a.element] && <img src={ELEMENT_ICONS[a.element]} style={{ width: '16px', height: '16px' }} />}
                <span style={{ ...styles.avatarName, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' }}>{a.name}</span>
              </div>
              <span style={styles.avatarInfo}>
                Lv.{a.level} ★{a.rarity} 命座{a.actived_constellation_num} 好感{a.fetter}
              </span>
            </div>
          ))}
          {sorted.length > 10 && <div style={{ fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '4px 0' }}>共 {sorted.length} 个角色</div>}
        </div>
      )}
    </>
  );
}

// ─── 星铁 ────────────────────────────────────────────

function SrContent({ data }: { data: SrIndexData }) {
  const s = data.stats;
  const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
  const top = sorted.slice(0, 10);

  return (
    <>
      <div style={styles.section}>
        <div style={styles.statGrid}>
          <StatPair label='活跃天数' value={s.active_days} />
          <StatPair label='成就' value={s.achievement_num} />
          <StatPair label='角色数' value={s.avatar_num} />
          <StatPair label='宝箱' value={s.chest_num} />
          <StatPair label='忘却之庭' value={s.abyss_process} />
        </div>
      </div>

      {top.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>角色 (Top {top.length})</div>
          {top.map((a, i) => (
            <div key={i} style={styles.avatarRow}>
              <span style={{ ...styles.avatarName, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' }}>{a.name}</span>
              <span style={styles.avatarInfo}>
                Lv.{a.level} ★{a.rarity} 星魂{a.rank}
              </span>
            </div>
          ))}
          {sorted.length > 10 && <div style={{ fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '4px 0' }}>共 {sorted.length} 个角色</div>}
        </div>
      )}
    </>
  );
}

// ─── 绝区零 ──────────────────────────────────────────

function ZzzContent({ data }: { data: ZzzIndexData }) {
  const s = data.stats;
  const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level);
  const top = sorted.slice(0, 10);

  return (
    <>
      <div style={styles.section}>
        <div style={styles.statGrid}>
          <StatPair label='活跃天数' value={s.active_days} />
          <StatPair label='成就' value={s.achievement_count} />
          <StatPair label='代理人' value={s.avatar_num} />
          <StatPair label='邦布' value={s.buddy_num} />
          <StatPair label='式舆防卫战' value={`第${s.cur_period_zone_layer_count}层`} />
        </div>
      </div>

      {top.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>代理人 (Top {top.length})</div>
          {top.map((a, i) => (
            <div key={i} style={styles.avatarRow}>
              <span style={{ ...styles.avatarName, color: '#1e1f20' }}>{a.name_mi18n}</span>
              <span style={styles.avatarInfo}>
                Lv.{a.level} {a.rarity} 影画{a.rank}
              </span>
            </div>
          ))}
          {sorted.length > 10 && <div style={{ fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '4px 0' }}>共 {sorted.length} 个代理人</div>}
        </div>
      )}
    </>
  );
}

// ─── 主组件 ──────────────────────────────────────────

export default function PlayerIndexCard({ data }: PlayerIndexCardProps) {
  const gameInfo = GAME_LABELS[data.game];
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <HTML style={{ width: '600px' }}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={gameInfo.icon} style={{ width: '24px', height: '24px' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' }}>{gameInfo.name} · 角色面板</span>
          </div>
          <span style={{ fontSize: '13px', color: '#7a6b57' }}>UID {data.uid}</span>
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
