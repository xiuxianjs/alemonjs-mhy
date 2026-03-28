import { BG_IMAGES, ELEMENT_ICONS, UI_ICONS } from '@src/assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';
import { formatDate, getTheme } from './shared.js';

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

const GAME_ICONS: Record<string, string> = {
  gs: BG_IMAGES.genshinLogo,
  sr: UI_ICONS.role,
  zzz: UI_ICONS.role
};

// ─── 子组件 ──────────────────────────────────────────

/** 居中统计块 */
function StatBlock({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: '0',
        textAlign: 'center',
        padding: '10px 4px',
        background: '#faf8f5',
        borderRadius: '8px'
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: accent }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#9e8e7e', marginTop: '3px' }}>{label}</div>
    </div>
  );
}

/** 统计行 — 自动等分 */
function StatRow({ items, accent }: { items: Array<{ label: string; value: string | number }>; accent: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
      {items.map((it, i) => (
        <StatBlock key={i} label={it.label} value={it.value} accent={accent} />
      ))}
    </div>
  );
}

/** 带圆点 + 元素图标的角色行 */
/** 角色信息标签 */
function InfoTag({ label, value }: { label: string; value: string | number }) {
  return (
    <span
      style={{
        fontSize: '11px',
        color: '#6b5e4f',
        background: '#f0ede8',
        borderRadius: '4px',
        padding: '1px 6px'
      }}
    >
      {label}
      <span style={{ fontWeight: 'bold', color: '#4a4039' }}>{value}</span>
    </span>
  );
}

function AvatarRow({
  name,
  tags,
  rarity,
  elementIcon
}: {
  name: string;
  tags: Array<{ label: string; value: string | number }>;
  rarity: number;
  elementIcon?: string;
}) {
  const color = RARITY_COLORS[rarity] ?? '#1e1f20';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 10px',
        background: '#faf8f5',
        borderRadius: '6px',
        marginBottom: '4px',
        borderLeft: `3px solid ${color}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {elementIcon && <img src={elementIcon} style={{ width: '16px', height: '16px' }} />}
        <span style={{ fontSize: '13px', fontWeight: 'bold', color }}>{name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {tags.map((t, i) => (
          <InfoTag key={i} label={t.label} value={t.value} />
        ))}
      </div>
    </div>
  );
}

/** 分区标题 */
function SectionTitle({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#6b5e4f',
        padding: '8px 0 6px',
        borderBottom: '2px solid #f0ede8',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: '#c6923a' }} />
      {text}
    </div>
  );
}

/** 进度条 */
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#f0ede8', marginTop: '3px' }}>
      <div style={{ width: `${pct}%`, height: '6px', borderRadius: '3px', background: color }} />
    </div>
  );
}

// ─── 原神 ────────────────────────────────────────────

function GsContent({ data, accent }: { data: GsIndexData; accent: string }) {
  const s = data.stats;
  const sorted = [...data.avatars].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
  const top = sorted.slice(0, 10);

  return (
    <>
      <StatRow
        accent={accent}
        items={[
          { label: '活跃天数', value: s.active_day_number },
          { label: '成就', value: s.achievement_number },
          { label: '角色数', value: s.avatar_number },
          { label: '深渊', value: s.spiral_abyss }
        ]}
      />

      {data.world_explorations.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <SectionTitle text='世界探索' />
          {[...data.world_explorations]
            .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
            .slice(0, 8)
            .map((w, i) => {
              const pct = w.exploration_percentage / 10;

              return (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6b5e4f' }}>{w.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a3c2a' }}>{pct.toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={pct} max={100} color={accent} />
                </div>
              );
            })}
        </div>
      )}

      {top.length > 0 && (
        <div>
          <SectionTitle text={`角色 Top${top.length}`} />
          {top.map((a, i) => (
            <AvatarRow
              key={i}
              name={a.name}
              tags={[
                { label: 'Lv.', value: a.level },
                { label: '命座', value: a.actived_constellation_num },
                { label: '好感', value: a.fetter }
              ]}
              rarity={a.rarity}
              elementIcon={ELEMENT_ICONS[a.element]}
            />
          ))}
          {sorted.length > 10 && <div style={{ fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '6px 0' }}>共 {sorted.length} 个角色</div>}
        </div>
      )}
    </>
  );
}

// ─── 星铁 ────────────────────────────────────────────

function SrContent({ data, accent }: { data: SrIndexData; accent: string }) {
  const s = data.stats;
  const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
  const top = sorted.slice(0, 10);

  return (
    <>
      <StatRow
        accent={accent}
        items={[
          { label: '活跃天数', value: s.active_days },
          { label: '成就', value: s.achievement_num },
          { label: '角色数', value: s.avatar_num }
        ]}
      />
      <StatRow
        accent={accent}
        items={[
          { label: '宝箱', value: s.chest_num },
          { label: '忘却之庭', value: s.abyss_process }
        ]}
      />

      {top.length > 0 && (
        <div>
          <SectionTitle text={`角色 Top${top.length}`} />
          {top.map((a, i) => (
            <AvatarRow
              key={i}
              name={a.name}
              tags={[
                { label: 'Lv.', value: a.level },
                { label: '星魂', value: a.rank }
              ]}
              rarity={a.rarity}
            />
          ))}
          {sorted.length > 10 && <div style={{ fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '6px 0' }}>共 {sorted.length} 个角色</div>}
        </div>
      )}
    </>
  );
}

// ─── 绝区零 ──────────────────────────────────────────

function ZzzContent({ data, accent }: { data: ZzzIndexData; accent: string }) {
  const s = data.stats;
  const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level);
  const top = sorted.slice(0, 10);

  return (
    <>
      <StatRow
        accent={accent}
        items={[
          { label: '活跃天数', value: s.active_days },
          { label: '成就', value: s.achievement_count },
          { label: '代理人', value: s.avatar_num }
        ]}
      />
      <StatRow
        accent={accent}
        items={[
          { label: '邦布', value: s.buddy_num },
          { label: '式舆防卫战', value: `第${s.cur_period_zone_layer_count}层` }
        ]}
      />

      {top.length > 0 && (
        <div>
          <SectionTitle text={`代理人 Top${top.length}`} />
          {top.map((a, i) => (
            <AvatarRow
              key={i}
              name={a.name_mi18n}
              tags={[
                { label: 'Lv.', value: a.level },
                { label: '', value: a.rarity },
                { label: '影画', value: a.rank }
              ]}
              rarity={0}
            />
          ))}
          {sorted.length > 10 && <div style={{ fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '6px 0' }}>共 {sorted.length} 个代理人</div>}
        </div>
      )}
    </>
  );
}

// ─── 主组件 ──────────────────────────────────────────

export default function PlayerIndexCard({ data }: PlayerIndexCardProps) {
  const theme = getTheme(data.game);
  const dateStr = formatDate();
  const icon = GAME_ICONS[data.game] ?? GAME_ICONS.gs;

  return (
    <HTML style={{ width: '520px' }}>
      <div
        style={{
          padding: '24px',
          background: 'linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)',
          fontFamily: '"tttgbnumber", system-ui, sans-serif',
          fontSize: '14px',
          color: '#1e1f20'
        }}
      >
        {/* 头部 */}
        <div
          style={{
            background: theme.gradient,
            borderRadius: '12px 12px 0 0',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={icon} style={{ width: '24px', height: '24px' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.headerText }}>{theme.name} · 角色面板</span>
          </div>
          <span style={{ fontSize: '13px', color: theme.headerSub }}>UID {data.uid}</span>
        </div>

        {/* 内容 */}
        <div
          style={{
            background: '#fff',
            borderRadius: '0 0 12px 12px',
            padding: '16px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          {data.game === 'gs' && <GsContent data={data} accent={theme.accent} />}
          {data.game === 'sr' && <SrContent data={data} accent={theme.accent} />}
          {data.game === 'zzz' && <ZzzContent data={data} accent={theme.accent} />}
        </div>

        <div style={{ textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' }}>{dateStr}</div>
      </div>
    </HTML>
  );
}
