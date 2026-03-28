import { UI_ICONS } from '../../assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';

const RARITY_COLORS = {
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
        fontWeight: 'bold',
        color: '#4a3c2a'
    },
    medal: {
        fontSize: '14px',
        color: '#c6923a'
    },
    avatarList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px'
    },
    avatarTag: {
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '4px',
        background: '#f8f6f2'
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
function RoleCombatCard({ data }) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const noData = !data.has_data || data.data.length === 0;
    const noDetail = data.has_data && !data.has_detail_data;
    let schedule;
    let stat;
    let detail;
    if (!noData) {
        schedule = data.data[0].schedule;
        stat = data.data[0].stat;
        detail = data.data[0].detail;
    }
    return (React.createElement(HTML, { style: { width: '700px' } },
        React.createElement("div", { style: styles.card },
            React.createElement("div", { style: styles.header },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("img", { src: UI_ICONS.team, style: { width: '24px', height: '24px' } }),
                    React.createElement("span", { style: { fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' } }, "\u5E7B\u60F3\u771F\u5883\u5267\u8BD7")),
                React.createElement("span", { style: { fontSize: '13px', color: '#7a6b57' } },
                    "UID ",
                    data.uid)),
            React.createElement("div", { style: styles.body }, noData ? (React.createElement("div", { style: styles.noData }, "\u672C\u671F\u6682\u65E0\u6311\u6218\u6570\u636E")) : noDetail ? (React.createElement("div", { style: styles.noData }, "\u6570\u636E\u8FD8\u6CA1\u66F4\u65B0\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5")) : (React.createElement(React.Fragment, null,
                schedule && (React.createElement(StatRow, { label: '\u5468\u671F', value: `${schedule.start_date_time.month}/${schedule.start_date_time.day} ~ ${schedule.end_date_time.month}/${schedule.end_date_time.day}` })),
                stat && (React.createElement(React.Fragment, null,
                    React.createElement(StatRow, { label: '\u6700\u6DF1\u5E55\u6570', value: `第${stat.max_round_id}幕` }),
                    React.createElement(StatRow, { label: '\u5F02\u7AEF\u503C', value: stat.heresy_count }),
                    React.createElement(StatRow, { label: '\u83B7\u53D6\u91D1\u5E01', value: stat.coin_num }),
                    React.createElement(StatRow, { label: '\u52A9\u6218\u6B21\u6570', value: `${stat.rent_cnt}次` }))),
                detail && detail.rounds_data.length > 0 && (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: styles.sectionTitle }, "\u5404\u5E55\u9635\u5BB9"),
                    detail.rounds_data.map((round, ri) => (React.createElement("div", { key: ri, style: styles.roundBox },
                        React.createElement("div", { style: styles.roundHeader },
                            React.createElement("span", { style: styles.roundTitle },
                                "\u7B2C",
                                round.round_id,
                                "\u5E55"),
                            round.is_get_medal && React.createElement("span", { style: styles.medal }, "\u2726 \u52CB\u7AE0")),
                        React.createElement("div", { style: styles.avatarList }, round.avatars.map((a, ai) => (React.createElement("span", { key: ai, style: { ...styles.avatarTag, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' } },
                            a.name,
                            " Lv.",
                            a.level))))))))),
                detail && detail.backup_avatars.length > 0 && (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: styles.sectionTitle }, "\u5019\u9009\u89D2\u8272"),
                    React.createElement("div", { style: styles.avatarList }, detail.backup_avatars.map((a, ai) => (React.createElement("span", { key: ai, style: { ...styles.avatarTag, color: RARITY_COLORS[a.rarity] ?? '#1e1f20' } },
                        a.name,
                        " Lv.",
                        a.level))))))))),
            React.createElement("div", { style: { textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' } }, dateStr))));
}

export { RoleCombatCard as default };
