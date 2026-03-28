import { UI_ICONS, BG_IMAGES, ELEMENT_ICONS, REGION_ICONS } from '../../assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';
import { getTheme, formatDate } from './shared.js';

const GAME_LABELS = {
    gs: { name: '原神', icon: BG_IMAGES.genshinLogo, color: '#8b6d3f' },
    sr: { name: '星穹铁道', icon: UI_ICONS.role, color: '#5c6bc0' },
    zzz: { name: '绝区零', icon: UI_ICONS.role, color: '#e65100' }
};
const OCULUS_NAMES = [
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
        flexWrap: 'wrap'
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
    chestGrid: {
        display: 'flex',
        flexWrap: 'wrap',
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
function StatPair({ label, value, icon }) {
    return (React.createElement("div", { style: styles.statItem },
        React.createElement("span", { style: { ...styles.statLabel, display: 'flex', alignItems: 'center', gap: '4px' } },
            icon && React.createElement("img", { src: icon, style: { width: '16px', height: '16px' } }),
            label),
        React.createElement("span", { style: styles.statValue }, value)));
}
function ProgressBar({ value, max, color }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (React.createElement("div", { style: styles.progressBg },
        React.createElement("div", { style: { width: `${pct}%`, height: '6px', borderRadius: '3px', background: color } })));
}
function GsContent({ data }) {
    const s = data.stats;
    const totalChest = s.luxurious_chest_number + s.precious_chest_number + s.exquisite_chest_number + s.common_chest_number + s.magic_chest_number;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.statGrid },
                React.createElement(StatPair, { label: '\u6210\u5C31', value: s.achievement_number }),
                React.createElement(StatPair, { label: '\u89D2\u8272\u6570', value: s.avatar_number }))),
        React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.sectionTitle },
                "\uD83C\uDF81 \u5B9D\u7BB1 \u00B7 \u5171 ",
                totalChest),
            React.createElement("div", { style: styles.chestGrid },
                React.createElement(StatPair, { label: '\u534E\u4E3D', value: s.luxurious_chest_number }),
                React.createElement(StatPair, { label: '\u73CD\u8D35', value: s.precious_chest_number }),
                React.createElement(StatPair, { label: '\u7CBE\u81F4', value: s.exquisite_chest_number }),
                React.createElement(StatPair, { label: '\u666E\u901A', value: s.common_chest_number }),
                React.createElement(StatPair, { label: '\u5947\u9988', value: s.magic_chest_number }))),
        React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.sectionTitle }, "\u2728 \u795E\u77B3"),
            React.createElement("div", { style: styles.statGrid }, OCULUS_NAMES.map((o, i) => {
                const val = s[o.key] ?? 0;
                const elemIcon = ELEMENT_ICONS[o.element];
                return val > 0 ? React.createElement(StatPair, { key: i, label: o.label, value: val, icon: elemIcon }) : null;
            }))),
        data.homes && data.homes.length > 0 && (React.createElement("div", { style: styles.section },
            React.createElement("div", { style: styles.sectionTitle }, "\uD83C\uDFE0 \u5C18\u6B4C\u58F6"),
            React.createElement("div", { style: styles.statGrid },
                React.createElement(StatPair, { label: '\u7B49\u7EA7', value: data.homes[0].level }),
                React.createElement(StatPair, { label: '\u4ED9\u529B', value: data.homes[0].comfort_num }),
                React.createElement(StatPair, { label: '\u6446\u8BBE', value: data.homes[0].item_num })))),
        data.world_explorations.length > 0 && (React.createElement("div", null,
            React.createElement("div", { style: styles.sectionTitle }, "\uD83D\uDDFA\uFE0F \u4E16\u754C\u63A2\u7D22"),
            [...data.world_explorations]
                .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
                .map((w, i) => {
                const pct = w.exploration_percentage / 10;
                const offerings = w.offerings?.length > 0 ? w.offerings.map(o => `${o.name}Lv.${o.level}`).join(' ') : '';
                return (React.createElement("div", { key: i },
                    React.createElement("div", { style: styles.exploreRow },
                        React.createElement("span", { style: { fontSize: '13px', color: '#6b5e4f', display: 'flex', alignItems: 'center', gap: '4px' } },
                            REGION_ICONS[w.name] && React.createElement("img", { src: REGION_ICONS[w.name], style: { width: '18px', height: '18px', borderRadius: '3px' } }),
                            w.name),
                        React.createElement("span", { style: { fontSize: '13px', fontWeight: 'bold' } },
                            pct.toFixed(1),
                            "%")),
                    React.createElement(ProgressBar, { value: pct, max: 100, color: '#8b6d3f' }),
                    offerings && React.createElement("div", { style: { fontSize: '11px', color: '#9e8e7e', marginTop: '-2px', marginBottom: '2px' } }, offerings)));
            })))));
}
function SrContent({ data }) {
    const s = data.stats;
    return (React.createElement("div", { style: styles.statGrid },
        React.createElement(StatPair, { label: '\u6D3B\u8DC3\u5929\u6570', value: s.active_days }),
        React.createElement(StatPair, { label: '\u89D2\u8272\u6570', value: s.avatar_num }),
        React.createElement(StatPair, { label: '\u6210\u5C31', value: s.achievement_num }),
        React.createElement(StatPair, { label: '\u5B9D\u7BB1', value: s.chest_num }),
        React.createElement(StatPair, { label: '\u5FD8\u5374\u4E4B\u5EAD', value: s.abyss_process })));
}
function ZzzContent({ data }) {
    const s = data.stats;
    return (React.createElement("div", { style: styles.statGrid },
        React.createElement(StatPair, { label: '\u6D3B\u8DC3\u5929\u6570', value: s.active_days }),
        React.createElement(StatPair, { label: '\u4EE3\u7406\u4EBA', value: s.avatar_num }),
        React.createElement(StatPair, { label: '\u90A6\u5E03', value: s.buddy_num }),
        React.createElement(StatPair, { label: '\u6210\u5C31', value: s.achievement_count }),
        React.createElement(StatPair, { label: '\u5F0F\u8206\u9632\u536B\u6218', value: `第${s.cur_period_zone_layer_count}层` }),
        s.world_level_name && React.createElement(StatPair, { label: '\u7B49\u7EA7', value: s.world_level_name })));
}
function RoleExploreCard({ data }) {
    const gameInfo = GAME_LABELS[data.game];
    const theme = getTheme(data.game);
    const dateStr = formatDate();
    return (React.createElement(HTML, { style: { width: '600px' } },
        React.createElement("div", { style: styles.card },
            React.createElement("div", { style: { ...styles.header, background: theme.gradient } },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("img", { src: gameInfo.icon, style: { width: '24px', height: '24px' } }),
                    React.createElement("span", { style: { fontSize: '18px', fontWeight: 'bold', color: theme.headerText } },
                        gameInfo.name,
                        " \u00B7 \u63A2\u7D22")),
                React.createElement("span", { style: { fontSize: '13px', color: theme.headerSub } },
                    "UID ",
                    data.uid)),
            React.createElement("div", { style: styles.body },
                data.game === 'gs' && React.createElement(GsContent, { data: data }),
                data.game === 'sr' && React.createElement(SrContent, { data: data }),
                data.game === 'zzz' && React.createElement(ZzzContent, { data: data })),
            React.createElement("div", { style: { textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' } }, dateStr))));
}

export { RoleExploreCard as default };
