import React from 'react';
import HTML from './HTML.js';

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const PERCENT_100 = 100;
const formatTime = (seconds) => {
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
const formatRecoverAt = (seconds) => {
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
const percent = (cur, max) => (max > 0 ? (cur / max) * PERCENT_100 : 0);
const GAME_LABELS = {
    gs: { name: '原神', color: '#8b6d3f', icon: '🌿' },
    sr: { name: '星穹铁道', color: '#5c6bc0', icon: '🚂' },
    zzz: { name: '绝区零', color: '#e65100', icon: '⚡' }
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
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#1e1f20'
    },
    valueFull: {
        fontWeight: 'bold',
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
function ProgressBar({ value, max, color }) {
    const pct = percent(value, max);
    return (React.createElement("div", { style: styles.progressBg },
        React.createElement("div", { style: {
                width: `${pct}%`,
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(90deg, ${color}, ${color}cc)`
            } })));
}
function Row({ icon, label, value, sub, isFull, isLast }) {
    return (React.createElement("div", { style: isLast ? styles.rowLast : styles.row },
        React.createElement("div", { style: styles.label },
            React.createElement("span", null, icon),
            React.createElement("span", null, label)),
        React.createElement("div", { style: { textAlign: 'right' } },
            React.createElement("div", { style: isFull ? styles.valueFull : styles.value }, value),
            sub && React.createElement("div", { style: styles.sub }, sub))));
}
function GsCard({ data }) {
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
        }
        else if (data.transformer.recovery_time.reached) {
            transformerText = '可使用';
        }
        else {
            const t = data.transformer.recovery_time;
            const parts = [];
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
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { icon: '\uD83C\uDF19', label: '\u539F\u7CB9\u6811\u8102', value: `${data.current_resin} / ${data.max_resin}`, sub: resinFull ? '已满' : `${formatTime(resinSec)} · ${formatRecoverAt(resinSec)}`, isFull: resinFull }),
        React.createElement(ProgressBar, { value: data.current_resin, max: data.max_resin, color: '#8b6d3f' }),
        React.createElement("div", { style: { height: '8px' } }),
        React.createElement(Row, { icon: '\uD83D\uDCCB', label: '\u6BCF\u65E5\u59D4\u6258', value: `${data.finished_task_num} / ${data.total_task_num}`, isFull: data.finished_task_num >= data.total_task_num }),
        React.createElement(Row, { icon: '\uD83D\uDCB0', label: '\u6D1E\u5929\u5B9D\u94B1', value: `${data.current_home_coin} / ${data.max_home_coin}`, sub: coinFull ? '已满' : formatTime(coinSec), isFull: coinFull }),
        React.createElement(Row, { icon: '\uD83E\uDDED', label: '\u63A2\u7D22\u6D3E\u9063', value: `${expDone} / ${expTotal} 完成`, sub: expDone < expTotal ? '进行中' : '全部完成', isFull: expDone >= expTotal }),
        data.transformer && React.createElement(Row, { icon: '\uD83D\uDD2E', label: '\u53C2\u91CF\u8D28\u53D8\u4EEA', value: transformerText, isFull: data.transformer.recovery_time?.reached, isLast: true })));
}
function SrCard({ data }) {
    const staminaFull = data.current_stamina >= data.max_stamina;
    const expDone = data.expeditions.filter(e => e.remaining_time <= 0).length;
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { icon: '\u26A1', label: '\u5F00\u62D3\u529B', value: `${data.current_stamina} / ${data.max_stamina}`, sub: staminaFull ? '已满' : `${formatTime(data.stamina_recover_time)} · ${formatRecoverAt(data.stamina_recover_time)}`, isFull: staminaFull }),
        React.createElement(ProgressBar, { value: data.current_stamina, max: data.max_stamina, color: '#5c6bc0' }),
        React.createElement("div", { style: { height: '8px' } }),
        React.createElement(Row, { icon: '\uD83D\uDD0B', label: '\u540E\u5907\u5F00\u62D3\u529B', value: `${data.current_reserve_stamina}` }),
        React.createElement(Row, { icon: '\uD83D\uDCCB', label: '\u6BCF\u65E5\u5B9E\u8BAD', value: `${data.current_train_score} / ${data.max_train_score}`, isFull: data.current_train_score >= data.max_train_score }),
        React.createElement(Row, { icon: '\uD83E\uDDED', label: '\u59D4\u6258\u6D3E\u9063', value: `${expDone} / ${data.expeditions.length} 完成`, sub: expDone < data.expeditions.length ? '进行中' : '全部完成', isLast: true })));
}
function ZzzCard({ data }) {
    const cur = data.energy.progress.current;
    const max = data.energy.progress.max;
    const full = cur >= max;
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { icon: '\uD83D\uDD0B', label: '\u7535\u91CF', value: `${cur} / ${max}`, sub: full ? '已满' : `${formatTime(data.energy.restore)} · ${formatRecoverAt(data.energy.restore)}`, isFull: full }),
        React.createElement(ProgressBar, { value: cur, max: max, color: '#e65100' }),
        React.createElement("div", { style: { height: '8px' } }),
        React.createElement(Row, { icon: '\uD83D\uDD25', label: '\u6D3B\u8DC3\u5EA6', value: `${data.vitality.current} / ${data.vitality.max}`, isFull: data.vitality.current >= data.vitality.max, isLast: true })));
}
function DailyNoteCard({ data }) {
    const gameInfo = GAME_LABELS[data.game];
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return (React.createElement(HTML, { style: { width: '480px' } },
        React.createElement("div", { style: styles.card },
            React.createElement("div", { style: styles.header },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("span", { style: { fontSize: '20px' } }, gameInfo.icon),
                    React.createElement("span", { style: { fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' } },
                        gameInfo.name,
                        " \u00B7 \u5B9E\u65F6\u4FBF\u7B3A")),
                React.createElement("span", { style: { fontSize: '13px', color: '#7a6b57' } },
                    "UID ",
                    data.uid)),
            React.createElement("div", { style: styles.body },
                data.game === 'gs' && React.createElement(GsCard, { data: data }),
                data.game === 'sr' && React.createElement(SrCard, { data: data }),
                data.game === 'zzz' && React.createElement(ZzzCard, { data: data })),
            React.createElement("div", { style: {
                    textAlign: 'right',
                    padding: '8px 4px 0',
                    fontSize: '11px',
                    color: '#b0a89c'
                } }, dateStr))));
}

export { DailyNoteCard as default };
