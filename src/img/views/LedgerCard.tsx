import React from 'react';
import HTML from './HTML.js';

// ─── 类型定义 ────────────────────────────────────────

interface LedgerGroupItem {
  action_id?: number;
  action?: string;
  action_name: string;
  num: number;
  percent: number;
}

export interface GsLedgerData {
  game: 'gs';
  uid: string;
  data_month: number;
  month_data: {
    current_primogems: number;
    current_mora: number;
    last_primogems: number;
    last_mora: number;
    primogem_rate: number;
    mora_rate: number;
    group_by: LedgerGroupItem[];
  };
  day_data: {
    current_primogems: number;
    current_mora: number;
  };
}

export interface SrLedgerData {
  game: 'sr';
  uid: string;
  data_month: string;
  month_data: {
    current_hcoin: number;
    current_rails_pass: number;
    last_hcoin: number;
    last_rails_pass: number;
    hcoin_rate: number;
    rails_rate: number;
    group_by: LedgerGroupItem[];
  };
  day_data: {
    current_hcoin: number;
    current_rails_pass: number;
  };
}

export type LedgerData = GsLedgerData | SrLedgerData;

export interface LedgerCardProps {
  data: LedgerData;
}

// ─── 工具 ────────────────────────────────────────────

const formatBigNum = (num: number): string => {
  if (num > 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }

  return String(num);
};

const BAR_COLORS = ['#c6923a', '#5c6bc0', '#e65100', '#2e7d32', '#ad1457', '#00838f', '#6d4c41', '#546e7a'];

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
    fontSize: '15px'
  },
  sub: {
    fontSize: '12px',
    color: '#9e8e7e'
  },
  bigNum: {
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#c6923a',
    textAlign: 'center' as const,
    padding: '8px 0'
  },
  pullText: {
    fontSize: '13px',
    color: '#9e8e7e',
    textAlign: 'center' as const,
    marginTop: '-4px',
    marginBottom: '8px'
  },
  sectionTitle: {
    fontSize: '13px',
    color: '#9e8e7e',
    borderBottom: '1px solid #f0ede8',
    paddingBottom: '6px',
    marginBottom: '8px',
    marginTop: '12px'
  },
  barRow: {
    padding: '5px 0'
  },
  barLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '3px'
  },
  barBg: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#f0ede8'
  },
  rateUp: {
    color: '#2e7d32',
    fontSize: '12px'
  },
  rateDown: {
    color: '#c62828',
    fontSize: '12px'
  }
};

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <div style={styles.value}>{value}</div>
        {sub && <div style={styles.sub}>{sub}</div>}
      </div>
    </div>
  );
}

function SourceBar({ name, num, percent, color }: { name: string; num: number; percent: number; color: string }) {
  return (
    <div style={styles.barRow}>
      <div style={styles.barLabel}>
        <span style={{ color: '#6b5e4f' }}>{name}</span>
        <span style={{ color: '#1e1f20', fontWeight: 'bold' }}>
          {formatBigNum(num)} ({percent}%)
        </span>
      </div>
      <div style={styles.barBg}>
        <div style={{ width: `${percent}%`, height: '8px', borderRadius: '4px', background: color }} />
      </div>
    </div>
  );
}

function RateText({ rate }: { rate: number }) {
  if (rate > 0) {
    return <span style={styles.rateUp}>↑{rate}%</span>;
  }
  if (rate < 0) {
    return <span style={styles.rateDown}>↓{Math.abs(rate)}%</span>;
  }

  return <span style={styles.sub}>持平</span>;
}

// ─── 原神 ────────────────────────────────────────────

function GsContent({ data }: { data: GsLedgerData }) {
  const m = data.month_data;
  const d = data.day_data;
  const pulls = Math.floor(m.current_primogems / 160);

  return (
    <>
      <div style={styles.bigNum}>{formatBigNum(m.current_primogems)}</div>
      <div style={styles.pullText}>本月原石 ≈ {pulls} 抽</div>

      <StatRow label='本月摩拉' value={formatBigNum(m.current_mora)} />
      <StatRow label='今日原石' value={formatBigNum(d.current_primogems)} />
      <StatRow label='今日摩拉' value={formatBigNum(d.current_mora)} />

      <div style={styles.row}>
        <span style={styles.label}>上月原石 {formatBigNum(m.last_primogems)}</span>
        <RateText rate={m.primogem_rate} />
      </div>
      <div style={styles.row}>
        <span style={styles.label}>上月摩拉 {formatBigNum(m.last_mora)}</span>
        <RateText rate={m.mora_rate} />
      </div>

      {m.group_by && m.group_by.length > 0 && (
        <>
          <div style={styles.sectionTitle}>来源分布</div>
          {m.group_by.map((g, i) => (
            <SourceBar key={i} name={g.action_name} num={g.num} percent={g.percent} color={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </>
      )}
    </>
  );
}

// ─── 星铁 ────────────────────────────────────────────

function SrContent({ data }: { data: SrLedgerData }) {
  const m = data.month_data;
  const d = data.day_data;
  const pulls = Math.floor(m.current_hcoin / 160);

  return (
    <>
      <div style={styles.bigNum}>{formatBigNum(m.current_hcoin)}</div>
      <div style={styles.pullText}>本月星琼 ≈ {pulls} 抽</div>

      <StatRow label='本月通票' value={formatBigNum(m.current_rails_pass)} />
      <StatRow label='今日星琼' value={formatBigNum(d.current_hcoin)} />
      <StatRow label='今日通票' value={formatBigNum(d.current_rails_pass)} />

      <div style={styles.row}>
        <span style={styles.label}>上月星琼 {formatBigNum(m.last_hcoin)}</span>
        <RateText rate={m.hcoin_rate} />
      </div>
      <div style={styles.row}>
        <span style={styles.label}>上月通票 {formatBigNum(m.last_rails_pass)}</span>
        <RateText rate={m.rails_rate} />
      </div>

      {m.group_by && m.group_by.length > 0 && (
        <>
          <div style={styles.sectionTitle}>来源分布</div>
          {m.group_by.map((g, i) => {
            const name = g.action_name.length > 4 ? g.action_name.slice(0, 4) : g.action_name;

            return <SourceBar key={i} name={name} num={g.num} percent={g.percent} color={BAR_COLORS[i % BAR_COLORS.length]} />;
          })}
        </>
      )}
    </>
  );
}

// ─── 主组件 ──────────────────────────────────────────

const TITLES: Record<string, { name: string; icon: string }> = {
  gs: { name: '原神 · 札记', icon: '💎' },
  sr: { name: '星穹铁道 · 开拓月历', icon: '🚂' }
};

export default function LedgerCard({ data }: LedgerCardProps) {
  const info = TITLES[data.game];
  const month = data.game === 'gs' ? `${data.data_month}月` : data.data_month;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <HTML>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{info.icon}</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' }}>{info.name}</div>
              <div style={{ fontSize: '12px', color: '#7a6b57' }}>{month}</div>
            </div>
          </div>
          <span style={{ fontSize: '13px', color: '#7a6b57' }}>UID {data.uid}</span>
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
