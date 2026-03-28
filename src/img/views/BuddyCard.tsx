import { UI_ICONS } from '@src/assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';

// ─── 类型定义 ────────────────────────────────────────

export interface BuddyItem {
  id: number;
  name: string;
  rarity: string;
  level: number;
  star: number;
}

export interface BuddyCardData {
  uid: string;
  list: BuddyItem[];
}

export interface BuddyCardProps {
  data: BuddyCardData;
}

// ─── 样式 ────────────────────────────────────────────

const RARITY_STYLE: Record<string, string> = {
  S: '#c6923a',
  A: '#a256e1',
  B: '#5180cb'
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
  count: {
    textAlign: 'center' as const,
    fontSize: '13px',
    color: '#9e8e7e',
    padding: '4px 0 12px',
    borderBottom: '1px solid #f0ede8',
    marginBottom: '8px'
  },
  buddyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f8f6f2'
  },
  buddyLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  rarityBadge: {
    fontSize: '11px',
    padding: '1px 8px',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold' as const
  },
  buddyName: {
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  buddyInfo: {
    fontSize: '12px',
    color: '#6b5e4f'
  },
  noData: {
    textAlign: 'center' as const,
    padding: '20px 0',
    color: '#9e8e7e',
    fontSize: '14px'
  }
};

function StarDisplay({ count }: { count: number }) {
  return <span style={{ color: '#c6923a', fontSize: '12px' }}>{'★'.repeat(count)}</span>;
}

// ─── 主组件 ──────────────────────────────────────────

export default function BuddyCard({ data }: BuddyCardProps) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const buddies = data.list ?? [];
  const sorted = [...buddies].sort((a, b) => b.level - a.level || b.star - a.star);

  return (
    <HTML style={{ width: '450px' }}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={UI_ICONS.role} style={{ width: '24px', height: '24px' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' }}>绝区零 · 邦布</span>
          </div>
          <span style={{ fontSize: '13px', color: '#7a6b57' }}>UID {data.uid}</span>
        </div>

        <div style={styles.body}>
          {sorted.length === 0 ? (
            <div style={styles.noData}>暂无邦布数据</div>
          ) : (
            <>
              <div style={styles.count}>共 {sorted.length} 只邦布</div>
              {sorted.map((b, i) => {
                const color = RARITY_STYLE[b.rarity] ?? '#808080';

                return (
                  <div key={i} style={styles.buddyRow}>
                    <div style={styles.buddyLeft}>
                      <span style={{ ...styles.rarityBadge, background: color }}>{b.rarity}</span>
                      <span style={{ ...styles.buddyName, color }}>{b.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={styles.buddyInfo}>Lv.{b.level}</div>
                      <StarDisplay count={b.star} />
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
