import React from 'react';
import HTML from './HTML.js';

const RARITY_COLORS = {
    5: '#c6923a',
    4: '#a256e1',
    3: '#5180cb'
};
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
        flexWrap: 'wrap',
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
        fontWeight: 'bold',
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
        fontWeight: 'bold'
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
        fontWeight: 'bold'
    },
    progressBg: {
        width: '100%',
        height: '6px',
        borderRadius: '3px',
        background: '#f0ede8',
        marginTop: '2px'
    }
};
function StatPair({ label, value }) {
    return (React.createElement("div", { style: styles.statItem },
        React.createElement("span", { style: styles.statLabel }, label),
        React.createElement("span", { style: styles.statValue }, value)));
}
function ProgressBar({ value, max, color }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (React.createElement("div", { style: styles.progressBg },
        React.createElement("div", { style: {
                width: `${Math.min(pct, 100)}%`,
                height: '6px',
                borderRadius: '3px',
                background: color
            } })));
}
function GsContent({ data }) {
    const s = data.stats;
    const sorted = [...data.avatars].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
    const top = sorted.slice(0, 10);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.statGrid },
                React.createElement(StatPair, { label: '\u6D3B\u8DC3\u5929\u6570', value: s.active_day_number }),
                React.createElement(StatPair, { label: '\u6210\u5C31', value: s.achievement_number }),
                React.createElement(StatPair, { label: '\u89D2\u8272\u6570', value: s.avatar_number }),
                React.createElement(StatPair, { label: '\u6DF1\u6E0A', value: s.spiral_abyss }))),
        data.world_explorations.length > 0 && (React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.sectionTitle }, "\u4E16\u754C\u63A2\u7D22"),
            [...data.world_explorations]
                .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
                .slice(0, 8)
                .map((w, i) => {
                const pct = w.exploration_percentage / 10;
                return (React.createElement("div", { key: i },
                    React.createElement("div", { style: styles.exploreRow },
                        React.createElement("span", { style: styles.exploreName }, w.name),
                        React.createElement("span", { style: styles.explorePct },
                            pct.toFixed(1),
                            "%")),
                    React.createElement(ProgressBar, { value: pct, max: 100, color: '#8b6d3f' })));
            }))),
        top.length > 0 && (React.createElement("div", null,
            React.createElement("div", { style: styles.sectionTitle },
                "\u89D2\u8272 (Top ",
                top.length,
                ")"),
            top.map((a, i) => (React.createElement("div", { key: i, style: styles.avatarRow },
                React.createElement("span", { style: { ...styles.avatarName, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' } }, a.name),
                React.createElement("span", { style: styles.avatarInfo },
                    "Lv.",
                    a.level,
                    " \u2605",
                    a.rarity,
                    " \u547D\u5EA7",
                    a.actived_constellation_num,
                    " \u597D\u611F",
                    a.fetter)))),
            sorted.length > 10 && React.createElement("div", { style: { fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '4px 0' } },
                "\u5171 ",
                sorted.length,
                " \u4E2A\u89D2\u8272")))));
}
function SrContent({ data }) {
    const s = data.stats;
    const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
    const top = sorted.slice(0, 10);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.statGrid },
                React.createElement(StatPair, { label: '\u6D3B\u8DC3\u5929\u6570', value: s.active_days }),
                React.createElement(StatPair, { label: '\u6210\u5C31', value: s.achievement_num }),
                React.createElement(StatPair, { label: '\u89D2\u8272\u6570', value: s.avatar_num }),
                React.createElement(StatPair, { label: '\u5B9D\u7BB1', value: s.chest_num }),
                React.createElement(StatPair, { label: '\u5FD8\u5374\u4E4B\u5EAD', value: s.abyss_process }))),
        top.length > 0 && (React.createElement("div", null,
            React.createElement("div", { style: styles.sectionTitle },
                "\u89D2\u8272 (Top ",
                top.length,
                ")"),
            top.map((a, i) => (React.createElement("div", { key: i, style: styles.avatarRow },
                React.createElement("span", { style: { ...styles.avatarName, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' } }, a.name),
                React.createElement("span", { style: styles.avatarInfo },
                    "Lv.",
                    a.level,
                    " \u2605",
                    a.rarity,
                    " \u661F\u9B42",
                    a.rank)))),
            sorted.length > 10 && React.createElement("div", { style: { fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '4px 0' } },
                "\u5171 ",
                sorted.length,
                " \u4E2A\u89D2\u8272")))));
}
function ZzzContent({ data }) {
    const s = data.stats;
    const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level);
    const top = sorted.slice(0, 10);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.statGrid },
                React.createElement(StatPair, { label: '\u6D3B\u8DC3\u5929\u6570', value: s.active_days }),
                React.createElement(StatPair, { label: '\u6210\u5C31', value: s.achievement_count }),
                React.createElement(StatPair, { label: '\u4EE3\u7406\u4EBA', value: s.avatar_num }),
                React.createElement(StatPair, { label: '\u90A6\u5E03', value: s.buddy_num }),
                React.createElement(StatPair, { label: '\u5F0F\u8206\u9632\u536B\u6218', value: `第${s.cur_period_zone_layer_count}层` }))),
        top.length > 0 && (React.createElement("div", null,
            React.createElement("div", { style: styles.sectionTitle },
                "\u4EE3\u7406\u4EBA (Top ",
                top.length,
                ")"),
            top.map((a, i) => (React.createElement("div", { key: i, style: styles.avatarRow },
                React.createElement("span", { style: { ...styles.avatarName, color: '#1e1f20' } }, a.name_mi18n),
                React.createElement("span", { style: styles.avatarInfo },
                    "Lv.",
                    a.level,
                    " ",
                    a.rarity,
                    " \u5F71\u753B",
                    a.rank)))),
            sorted.length > 10 && React.createElement("div", { style: { fontSize: '12px', color: '#9e8e7e', textAlign: 'center', padding: '4px 0' } },
                "\u5171 ",
                sorted.length,
                " \u4E2A\u4EE3\u7406\u4EBA")))));
}
function PlayerIndexCard({ data }) {
    const gameInfo = GAME_LABELS[data.game];
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return (React.createElement(HTML, { style: { width: '600px' } },
        React.createElement("div", { style: styles.card },
            React.createElement("div", { style: styles.header },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("span", { style: { fontSize: '20px' } }, gameInfo.icon),
                    React.createElement("span", { style: { fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' } },
                        gameInfo.name,
                        " \u00B7 \u89D2\u8272\u9762\u677F")),
                React.createElement("span", { style: { fontSize: '13px', color: '#7a6b57' } },
                    "UID ",
                    data.uid)),
            React.createElement("div", { style: styles.body },
                data.game === 'gs' && React.createElement(GsContent, { data: data }),
                data.game === 'sr' && React.createElement(SrContent, { data: data }),
                data.game === 'zzz' && React.createElement(ZzzContent, { data: data })),
            React.createElement("div", { style: { textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' } }, dateStr))));
}

export { PlayerIndexCard as default };
