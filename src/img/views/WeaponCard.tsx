import React from 'react';
import HTML from './HTML.js';

// ─── 类型定义 ────────────────────────────────────────

export interface AvatarWeapon {
  id: number;
  name: string;
  icon: string;
  type_name: string;
  rarity: number;
  level: number;
  affix_level: number;
}

export interface AvatarInfo {
  id: number;
  name: string;
  rarity: number;
  level: number;
  weapon: AvatarWeapon;
}

export interface WeaponCardData {
  uid: string;
  avatars: AvatarInfo[];
  filterText: string;
}

export interface WeaponCardProps {
  data: WeaponCardData;
}

// ─── 样式 ────────────────────────────────────────────

const RARITY_COLORS: Record<number, string> = {
  5: '#c6923a',
  4: '#a256e1',
  3: '#5180cb',
  2: '#4a8f6d',
  1: '#808080'
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
  summary: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 12px',
    borderBottom: '1px solid #f0ede8',
    marginBottom: '8px'
  },
  summaryItem: {
    textAlign: 'center' as const
  },
  summaryNum: {
    fontSize: '18px',
    fontWeight: 'bold' as const
  },
  summaryLabel: {
    fontSize: '11px',
    color: '#9e8e7e'
  },
  weaponRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f8f6f2'
  },
  weaponLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  rarityBadge: {
    fontSize: '11px',
    padding: '1px 6px',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold' as const
  },
  weaponName: {
    fontSize: '13px',
    fontWeight: 'bold' as const
  },
  weaponInfo: {
    fontSize: '12px',
    color: '#6b5e4f'
  },
  equip: {
    fontSize: '11px',
    color: '#9e8e7e'
  }
};

// ─── 主组件 ──────────────────────────────────────────

export default function WeaponCard({ data }: WeaponCardProps) {
  const { uid, avatars, filterText } = data;

  let list = avatars.filter(a => a.weapon.rarity > 1);

  let filterRarity = 0;

  if (/五星|5星/.test(filterText)) {
    filterRarity = 5;
  } else if (/四星|4星/.test(filterText)) {
    filterRarity = 4;
  }

  if (filterRarity > 0) {
    list = list.filter(a => a.weapon.rarity === filterRarity);
  }

  list.sort((a, b) => {
    const diff = b.weapon.rarity - a.weapon.rarity;

    if (diff !== 0) {
      return diff;
    }

    const lvDiff = b.weapon.level - a.weapon.level;

    if (lvDiff !== 0) {
      return lvDiff;
    }

    return b.weapon.affix_level - a.weapon.affix_level;
  });

  const count5 = list.filter(a => a.weapon.rarity === 5).length;
  const count4 = list.filter(a => a.weapon.rarity === 4).length;
  const countOther = list.filter(a => a.weapon.rarity <= 3).length;

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const filterLabel = filterRarity > 0 ? ` · ${filterRarity}星` : '';

  return (
    <HTML style={{ width: '500px' }}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>⚔️</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' }}>原神 · 武器{filterLabel}</span>
          </div>
          <span style={{ fontSize: '13px', color: '#7a6b57' }}>UID {uid}</span>
        </div>

        <div style={styles.body}>
          {list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#9e8e7e' }}>暂无武器数据</div>
          ) : (
            <>
              <div style={styles.summary}>
                <div style={styles.summaryItem}>
                  <div style={{ ...styles.summaryNum, color: RARITY_COLORS[5] }}>{count5}</div>
                  <div style={styles.summaryLabel}>五星</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={{ ...styles.summaryNum, color: RARITY_COLORS[4] }}>{count4}</div>
                  <div style={styles.summaryLabel}>四星</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={{ ...styles.summaryNum, color: RARITY_COLORS[3] }}>{countOther}</div>
                  <div style={styles.summaryLabel}>三星及以下</div>
                </div>
              </div>

              {list.map((a, i) => {
                const w = a.weapon;

                return (
                  <div key={i} style={styles.weaponRow}>
                    <div style={styles.weaponLeft}>
                      <span style={{ ...styles.rarityBadge, background: RARITY_COLORS[w.rarity] ?? '#808080' }}>★{w.rarity}</span>
                      <span style={{ ...styles.weaponName, color: RARITY_COLORS[w.rarity] ?? '#1e1f20' }}>{w.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={styles.weaponInfo}>
                        Lv.{w.level} 精{w.affix_level}
                      </div>
                      <div style={styles.equip}>→ {a.name}</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div style={{ textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' }}>{dateStr}</div>
      </div>
    </HTML>
  );
}
