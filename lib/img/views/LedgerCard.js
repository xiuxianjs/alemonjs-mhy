import { UI_ICONS } from '../../assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';

const formatBigNum = (num) => {
    if (num > 10000) {
        return `${(num / 10000).toFixed(1)}w`;
    }
    return String(num);
};
const BAR_COLORS = ['#c6923a', '#5c6bc0', '#e65100', '#2e7d32', '#ad1457', '#00838f', '#6d4c41', '#546e7a'];
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
        fontSize: '15px'
    },
    sub: {
        fontSize: '12px',
        color: '#9e8e7e'
    },
    bigNum: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#c6923a',
        textAlign: 'center',
        padding: '8px 0'
    },
    pullText: {
        fontSize: '13px',
        color: '#9e8e7e',
        textAlign: 'center',
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
function StatRow({ label, value, sub }) {
    return (React.createElement("div", { style: styles.row },
        React.createElement("span", { style: styles.label }, label),
        React.createElement("div", { style: { textAlign: 'right' } },
            React.createElement("div", { style: styles.value }, value),
            sub && React.createElement("div", { style: styles.sub }, sub))));
}
function SourceBar({ name, num, percent, color }) {
    return (React.createElement("div", { style: styles.barRow },
        React.createElement("div", { style: styles.barLabel },
            React.createElement("span", { style: { color: '#6b5e4f' } }, name),
            React.createElement("span", { style: { color: '#1e1f20', fontWeight: 'bold' } },
                formatBigNum(num),
                " (",
                percent,
                "%)")),
        React.createElement("div", { style: styles.barBg },
            React.createElement("div", { style: { width: `${percent}%`, height: '8px', borderRadius: '4px', background: color } }))));
}
function RateText({ rate }) {
    if (rate > 0) {
        return React.createElement("span", { style: styles.rateUp },
            "\u2191",
            rate,
            "%");
    }
    if (rate < 0) {
        return React.createElement("span", { style: styles.rateDown },
            "\u2193",
            Math.abs(rate),
            "%");
    }
    return React.createElement("span", { style: styles.sub }, "\u6301\u5E73");
}
function GsContent({ data }) {
    const m = data.month_data;
    const d = data.day_data;
    const pulls = Math.floor(m.current_primogems / 160);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.bigNum }, formatBigNum(m.current_primogems)),
        React.createElement("div", { style: styles.pullText },
            "\u672C\u6708\u539F\u77F3 \u2248 ",
            pulls,
            " \u62BD"),
        React.createElement(StatRow, { label: '\u672C\u6708\u6469\u62C9', value: formatBigNum(m.current_mora) }),
        React.createElement(StatRow, { label: '\u4ECA\u65E5\u539F\u77F3', value: formatBigNum(d.current_primogems) }),
        React.createElement(StatRow, { label: '\u4ECA\u65E5\u6469\u62C9', value: formatBigNum(d.current_mora) }),
        React.createElement("div", { style: styles.row },
            React.createElement("span", { style: styles.label },
                "\u4E0A\u6708\u539F\u77F3 ",
                formatBigNum(m.last_primogems)),
            React.createElement(RateText, { rate: m.primogem_rate })),
        React.createElement("div", { style: styles.row },
            React.createElement("span", { style: styles.label },
                "\u4E0A\u6708\u6469\u62C9 ",
                formatBigNum(m.last_mora)),
            React.createElement(RateText, { rate: m.mora_rate })),
        m.group_by && m.group_by.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: styles.sectionTitle }, "\u6765\u6E90\u5206\u5E03"),
            m.group_by.map((g, i) => (React.createElement(SourceBar, { key: i, name: g.action_name, num: g.num, percent: g.percent, color: BAR_COLORS[i % BAR_COLORS.length] })))))));
}
function SrContent({ data }) {
    const m = data.month_data;
    const d = data.day_data;
    const pulls = Math.floor(m.current_hcoin / 160);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.bigNum }, formatBigNum(m.current_hcoin)),
        React.createElement("div", { style: styles.pullText },
            "\u672C\u6708\u661F\u743C \u2248 ",
            pulls,
            " \u62BD"),
        React.createElement(StatRow, { label: '\u672C\u6708\u901A\u7968', value: formatBigNum(m.current_rails_pass) }),
        React.createElement(StatRow, { label: '\u4ECA\u65E5\u661F\u743C', value: formatBigNum(d.current_hcoin) }),
        React.createElement(StatRow, { label: '\u4ECA\u65E5\u901A\u7968', value: formatBigNum(d.current_rails_pass) }),
        React.createElement("div", { style: styles.row },
            React.createElement("span", { style: styles.label },
                "\u4E0A\u6708\u661F\u743C ",
                formatBigNum(m.last_hcoin)),
            React.createElement(RateText, { rate: m.hcoin_rate })),
        React.createElement("div", { style: styles.row },
            React.createElement("span", { style: styles.label },
                "\u4E0A\u6708\u901A\u7968 ",
                formatBigNum(m.last_rails_pass)),
            React.createElement(RateText, { rate: m.rails_rate })),
        m.group_by && m.group_by.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: styles.sectionTitle }, "\u6765\u6E90\u5206\u5E03"),
            m.group_by.map((g, i) => {
                const name = g.action_name.length > 4 ? g.action_name.slice(0, 4) : g.action_name;
                return React.createElement(SourceBar, { key: i, name: name, num: g.num, percent: g.percent, color: BAR_COLORS[i % BAR_COLORS.length] });
            })))));
}
const TITLES = {
    gs: { name: '原神 · 札记', icon: UI_ICONS.ledger },
    sr: { name: '星穹铁道 · 开拓月历', icon: UI_ICONS.ledger }
};
function LedgerCard({ data }) {
    const info = TITLES[data.game];
    const month = data.game === 'gs' ? `${data.data_month}月` : data.data_month;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return (React.createElement(HTML, { style: { width: '500px' } },
        React.createElement("div", { style: styles.card },
            React.createElement("div", { style: styles.header },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("img", { src: info.icon, style: { width: '24px', height: '24px' } }),
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#4a3c2a' } }, info.name),
                        React.createElement("div", { style: { fontSize: '12px', color: '#7a6b57' } }, month))),
                React.createElement("span", { style: { fontSize: '13px', color: '#7a6b57' } },
                    "UID ",
                    data.uid)),
            React.createElement("div", { style: styles.body },
                data.game === 'gs' && React.createElement(GsContent, { data: data }),
                data.game === 'sr' && React.createElement(SrContent, { data: data })),
            React.createElement("div", { style: { textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' } }, dateStr))));
}

export { LedgerCard as default };
