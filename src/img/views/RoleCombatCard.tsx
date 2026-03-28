import React from 'react';
import HTML from './HTML.js';

// ─── 类型定义 ────────────────────────────────────────

export interface CombatRound {
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

export interface CombatDetail {
  rounds_data: CombatRound[];
  detail_stat: {
    difficulty_id: number;
    max_round_id: number;
    avatar_bonus_num: number;
    rent_cnt: number;
  };
  backup_avatars: Array<{ avatar_id: number; name: string; level: number; rarity: number }>;
}

export interface CombatSchedule {
  start_time: number;
  end_time: number;
  schedule_type: number;
  schedule_id: number;
  start_date_time: { year: string; month: string; day: string };
  end_date_time: { year: string; month: string; day: string };
}

export interface CombatStat {
  difficulty_id: number;
  max_round_id: number;
  heresy_count: number;
  avatar_bonus_num: number;
  rent_cnt: number;
  coin_num: number;
}

export interface RoleCombatData {
  uid: string;
  has_data: boolean;
  has_detail_data: boolean;
  data: Array<{
    detail: CombatDetail;
    stat: CombatStat;
    schedule: CombatSchedule;
  }>;
}

export interface RoleCombatCardProps {
  data: RoleCombatData;
}

// ─── 样式 ────────────────────────────────────────────

const RARITY_COLORS: Record<number, string> = {
  5: '#c6923a',
  4: '#a256e1',
  3: '#5180cb'
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
  roundBox: {
    padding: '8px 0',
    borderBottom: '1px solid #f8f6f2'
  },
  roundHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  roundTitle: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#4a3c2a'
  },
  medal: {
    fontSize: '14px',
    color: '#c6923a'
  },
  avatarList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px'
  },
  avatarTag: {
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
    background: '#f8f6f2'
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

// ─── 主组件 ──────────────────────────────────────────

export default function RoleCombatCard({ data }: RoleCombatCardProps) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const noData = !data.has_data || data.data.length === 0;
  const noDetail = data.has_data && !data.has_detail_data;

  let schedule: CombatSchedule | undefined;
  let stat: CombatStat | undefined;
  let detail: CombatDetail | undefined;

  if (!noData) {
    schedule = data.data[0].schedule;
    stat = data.data[0].stat;
    detail = data.data[0].detail;
  }

  return (
    <HTML style={{ width: '700px' }}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎭</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' }}>幻想真境剧诗</span>
          </div>
          <span style={{ fontSize: '13px', color: '#7a6b57' }}>UID {data.uid}</span>
        </div>

        <div style={styles.body}>
          {noData ? (
            <div style={styles.noData}>本期暂无挑战数据</div>
          ) : noDetail ? (
            <div style={styles.noData}>数据还没更新，请稍后再试</div>
          ) : (
            <>
              {schedule && (
                <StatRow
                  label='周期'
                  value={`${schedule.start_date_time.month}/${schedule.start_date_time.day} ~ ${schedule.end_date_time.month}/${schedule.end_date_time.day}`}
                />
              )}
              {stat && (
                <>
                  <StatRow label='最深幕数' value={`第${stat.max_round_id}幕`} />
                  <StatRow label='异端值' value={stat.heresy_count} />
                  <StatRow label='获取金币' value={stat.coin_num} />
                  <StatRow label='助战次数' value={`${stat.rent_cnt}次`} />
                </>
              )}

              {detail && detail.rounds_data.length > 0 && (
                <>
                  <div style={styles.sectionTitle}>各幕阵容</div>
                  {detail.rounds_data.map((round, ri) => (
                    <div key={ri} style={styles.roundBox}>
                      <div style={styles.roundHeader}>
                        <span style={styles.roundTitle}>第{round.round_id}幕</span>
                        {round.is_get_medal && <span style={styles.medal}>✦ 勋章</span>}
                      </div>
                      <div style={styles.avatarList}>
                        {round.avatars.map((a, ai) => (
                          <span key={ai} style={{ ...styles.avatarTag, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' }}>
                            {a.name} Lv.{a.level}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {detail && detail.backup_avatars.length > 0 && (
                <>
                  <div style={styles.sectionTitle}>候选角色</div>
                  <div style={styles.avatarList}>
                    {detail.backup_avatars.map((a, ai) => (
                      <span key={ai} style={{ ...styles.avatarTag, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' }}>
                        {a.name} Lv.{a.level}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div style={{ textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' }}>{dateStr}</div>
      </div>
    </HTML>
  );
}
