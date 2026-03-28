import { UI_ICONS } from '../../assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';

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
        fontWeight: 'bold',
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
    floorRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 0',
        borderBottom: '1px solid #f8f6f2'
    },
    floorName: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#4a3c2a'
    },
    stars: {
        fontSize: '13px',
        color: '#c6923a'
    },
    noData: {
        textAlign: 'center',
        padding: '20px 0',
        color: '#9e8e7e',
        fontSize: '14px'
    }
};
function StatRow({ label, value }) {
    return (React.createElement("div", { style: styles.row },
        React.createElement("span", { style: styles.label }, label),
        React.createElement("span", { style: styles.value }, value)));
}
function StarDisplay({ count, max }) {
    const filled = '★'.repeat(count);
    const empty = '☆'.repeat(max - count);
    return (React.createElement("span", { style: styles.stars },
        filled,
        empty));
}
function GsContent({ data }) {
    const highFloors = data.floors.filter(f => f.index >= 9);
    return (React.createElement(React.Fragment, null,
        React.createElement(StatRow, { label: '\u6700\u6DF1\u62B5\u8FBE', value: data.max_floor }),
        React.createElement(StatRow, { label: '\u603B\u661F\u6570', value: `${data.total_star}★` }),
        React.createElement(StatRow, { label: '\u6218\u6597\u6B21\u6570', value: `${data.total_win_times} / ${data.total_battle_times}` }),
        data.damage_rank.length > 0 && React.createElement(StatRow, { label: '\u6700\u5F3A\u4E00\u51FB', value: data.damage_rank[0].value.toLocaleString() }),
        data.defeat_rank.length > 0 && React.createElement(StatRow, { label: '\u6700\u591A\u51FB\u7834', value: data.defeat_rank[0].value.toLocaleString() }),
        data.take_damage_rank.length > 0 && React.createElement(StatRow, { label: '\u6700\u591A\u627F\u4F24', value: data.take_damage_rank[0].value.toLocaleString() }),
        highFloors.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: styles.sectionTitle }, "\u697C\u5C42\u8BE6\u60C5"),
            highFloors.map((floor, fi) => (React.createElement("div", { key: fi },
                React.createElement("div", { style: styles.floorRow },
                    React.createElement("span", { style: styles.floorName },
                        "\u7B2C",
                        floor.index,
                        "\u5C42"),
                    React.createElement(StarDisplay, { count: floor.star, max: floor.max_star })),
                floor.levels.map((level, li) => (React.createElement("div", { key: li, style: { padding: '3px 0 3px 16px', fontSize: '12px', color: '#6b5e4f', display: 'flex', justifyContent: 'space-between' } },
                    React.createElement("span", null,
                        "\u7B2C",
                        level.index,
                        "\u95F4"),
                    React.createElement(StarDisplay, { count: level.star, max: level.max_star })))))))))));
}
function SrContent({ data }) {
    if (!data.has_data) {
        return React.createElement("div", { style: styles.noData }, "\u672C\u671F\u6682\u65E0\u6311\u6218\u6570\u636E");
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(StatRow, { label: '\u6700\u6DF1\u62B5\u8FBE', value: data.max_floor }),
        React.createElement(StatRow, { label: '\u603B\u661F\u6570', value: `${data.total_stars}★` }),
        React.createElement(StatRow, { label: '\u6218\u6597\u6B21\u6570', value: data.total_battles }),
        data.all_floor_detail.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: styles.sectionTitle }, "\u697C\u5C42\u8BE6\u60C5"),
            data.all_floor_detail.map((floor, fi) => (React.createElement("div", { key: fi, style: styles.floorRow },
                React.createElement("div", null,
                    React.createElement("div", { style: styles.floorName }, floor.name),
                    React.createElement("div", { style: { fontSize: '11px', color: '#9e8e7e' } },
                        floor.round_num,
                        "\u8F6E")),
                React.createElement(StarDisplay, { count: floor.star_num, max: 3 }))))))));
}
const TITLES = {
    gs: { name: '原神 · 深境螺旋', icon: UI_ICONS.abyss },
    sr: { name: '星穹铁道 · 忘却之庭', icon: UI_ICONS.abyss }
};
function SpiralAbyssCard({ data }) {
    const info = TITLES[data.game];
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return (React.createElement(HTML, { style: { width: '600px' } },
        React.createElement("div", { style: styles.card },
            React.createElement("div", { style: styles.header },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("img", { src: info.icon, style: { width: '24px', height: '24px' } }),
                    React.createElement("span", { style: { fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' } }, info.name)),
                React.createElement("span", { style: { fontSize: '13px', color: '#7a6b57' } },
                    "UID ",
                    data.uid)),
            React.createElement("div", { style: styles.body },
                data.game === 'gs' && React.createElement(GsContent, { data: data }),
                data.game === 'sr' && React.createElement(SrContent, { data: data })),
            React.createElement("div", { style: { textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' } }, dateStr))));
}

export { SpiralAbyssCard as default };
