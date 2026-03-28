import { UI_ICONS } from '../../assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';
import { formatDate } from './shared.js';

const GAME_COLORS = {
    原神: '#8b6d3f',
    星穹铁道: '#5c6bc0',
    绝区零: '#e65100'
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
    listRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '8px 0',
        borderBottom: '1px solid #f0ede8',
        gap: '12px'
    },
    index: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#c6923a',
        flexShrink: 0,
        width: '20px'
    },
    subject: {
        fontSize: '13px',
        color: '#1e1f20',
        flex: 1,
        lineHeight: '1.4'
    },
    date: {
        fontSize: '11px',
        color: '#9e8e7e',
        flexShrink: 0
    },
    detailTitle: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#4a3c2a',
        lineHeight: '1.5',
        paddingBottom: '8px',
        borderBottom: '1px solid #f0ede8',
        marginBottom: '10px'
    },
    detailDate: {
        fontSize: '12px',
        color: '#9e8e7e',
        marginBottom: '12px'
    },
    detailContent: {
        fontSize: '13px',
        color: '#3a3a3a',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
    },
    hint: {
        fontSize: '12px',
        color: '#9e8e7e',
        textAlign: 'center',
        padding: '8px 0 0'
    },
    noData: {
        textAlign: 'center',
        padding: '20px 0',
        color: '#9e8e7e',
        fontSize: '14px'
    }
};
function ListContent({ data }) {
    if (data.items.length === 0) {
        return React.createElement("div", { style: styles.noData },
            "\u6682\u65E0",
            data.typeName,
            "\u6570\u636E");
    }
    return (React.createElement(React.Fragment, null,
        data.items.map((item, i) => (React.createElement("div", { key: i, style: styles.listRow },
            React.createElement("span", { style: styles.index }, i + 1),
            React.createElement("span", { style: styles.subject }, item.subject),
            React.createElement("span", { style: styles.date }, item.date)))),
        React.createElement("div", { style: styles.hint },
            "\u53D1\u9001 #",
            data.typeName,
            "+\u5E8F\u53F7 \u67E5\u770B\u8BE6\u60C5")));
}
function DetailContent({ data }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.detailTitle }, data.subject),
        React.createElement("div", { style: styles.detailDate },
            "\u53D1\u5E03\u65F6\u95F4: ",
            data.date),
        React.createElement("div", { style: styles.detailContent }, data.content)));
}
function MysNewsCard({ data }) {
    const accent = GAME_COLORS[data.game] ?? '#8b6d3f';
    const title = `${data.game} · ${data.typeName}${data.mode === 'list' ? '列表' : ''}`;
    const dateStr = formatDate();
    return (React.createElement(HTML, { style: { width: '500px' } },
        React.createElement("div", { style: styles.card },
            React.createElement("div", { style: styles.header },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("img", { src: UI_ICONS.miyoushe, style: { width: '24px', height: '24px' } }),
                    React.createElement("span", { style: { fontSize: '18px', fontWeight: 'bold', color: accent } }, title))),
            React.createElement("div", { style: styles.body },
                data.mode === 'list' && React.createElement(ListContent, { data: data }),
                data.mode === 'detail' && React.createElement(DetailContent, { data: data })),
            React.createElement("div", { style: { textAlign: 'right', padding: '8px 4px 0', fontSize: '11px', color: '#b0a89c' } }, dateStr))));
}

export { MysNewsCard as default };
