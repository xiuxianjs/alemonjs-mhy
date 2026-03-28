import React from 'react';
import HTML from './HTML.js';

const STATUS_CONFIG = {
    waiting: { label: '等待扫码', color: '#8b6d3f', bg: '#fdf6e3', icon: '📱' },
    scanned: { label: '已扫码 · 请在手机上确认', color: '#2d7d46', bg: '#e8f5e9', icon: '✅' },
    confirmed: { label: '登录成功', color: '#1565c0', bg: '#e3f2fd', icon: '🎉' },
    expired: { label: '二维码已过期', color: '#c62828', bg: '#fce4ec', icon: '⏰' },
    error: { label: '获取失败', color: '#c62828', bg: '#fce4ec', icon: '❌' }
};
function QrLoginCard({ data }) {
    const { qrDataUrl, status, uidLines } = data;
    const cfg = STATUS_CONFIG[status];
    return (React.createElement(HTML, { style: { width: '380px' } },
        React.createElement("div", { style: {
                padding: '20px',
                background: 'linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)',
                fontFamily: '"tttgbnumber", system-ui, sans-serif',
                fontSize: '16px',
                color: '#1e1f20'
            } },
            React.createElement("div", { style: {
                    background: 'linear-gradient(135deg, #e8d5b0, #d3bc8e)',
                    borderRadius: '16px 16px 0 0',
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                } },
                React.createElement("span", { style: { fontSize: '28px' } }, "\uD83D\uDD10"),
                React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
                    React.createElement("span", { style: { fontSize: '20px', fontWeight: 'bold', color: '#4a3a20' } }, "\u7C73\u6E38\u793E \u00B7 \u626B\u7801\u767B\u5F55"),
                    React.createElement("span", { style: { fontSize: '12px', color: '#6b5838', marginTop: '2px' } }, "Cookie & Stoken \u4E00\u952E\u7ED1\u5B9A"))),
            React.createElement("div", { style: {
                    background: '#fff',
                    borderRadius: '0 0 16px 16px',
                    padding: '24px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                } },
                React.createElement("div", { style: {
                        background: '#fff',
                        border: '3px solid #e8d5b0',
                        borderRadius: '16px',
                        padding: '12px',
                        boxShadow: '0 2px 12px rgba(211,188,142,0.25)',
                        position: 'relative'
                    } },
                    React.createElement("img", { src: qrDataUrl, style: {
                            width: '220px',
                            height: '220px',
                            borderRadius: '8px',
                            display: 'block',
                            opacity: status === 'expired' || status === 'error' ? 0.3 : 1
                        } }),
                    (status === 'expired' || status === 'error') && (React.createElement("div", { style: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                        } }, status === 'expired' ? '已过期' : '获取失败'))),
                React.createElement("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: cfg.bg,
                        padding: '10px 20px',
                        borderRadius: '24px',
                        border: `1px solid ${cfg.color}20`
                    } },
                    React.createElement("span", { style: { fontSize: '18px' } }, cfg.icon),
                    React.createElement("span", { style: { fontSize: '15px', fontWeight: 'bold', color: cfg.color } }, cfg.label)),
                (status === 'waiting' || status === 'scanned') && (React.createElement("div", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        width: '100%',
                        padding: '0 8px'
                    } }, [
                    { step: '1', text: '打开 米游社App', highlight: '米游社App' },
                    { step: '2', text: '点击右下角 我的', highlight: '我的' },
                    { step: '3', text: '点击左上角 扫一扫', highlight: '扫一扫' },
                    { step: '4', text: '扫描上方二维码并确认登录', highlight: '确认登录' }
                ].map((item, idx) => (React.createElement("div", { key: idx, style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#faf8f4',
                        padding: '10px 14px',
                        borderRadius: '10px'
                    } },
                    React.createElement("div", { style: {
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #d3bc8e, #c4a870)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            color: '#fff',
                            flexShrink: 0
                        } }, item.step),
                    React.createElement("span", { style: { fontSize: '14px', color: '#4a3a20' } }, item.text)))))),
                status === 'confirmed' && uidLines && uidLines.length > 0 && (React.createElement("div", { style: {
                        width: '100%',
                        background: '#f0f7ff',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        border: '1px solid #bbdefb'
                    } },
                    React.createElement("div", { style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#1565c0',
                            marginBottom: '8px'
                        } }, "\u5DF2\u7ED1\u5B9A\u89D2\u8272"),
                    uidLines.map((line, idx) => (React.createElement("div", { key: idx, style: {
                            fontSize: '13px',
                            color: '#37474f',
                            padding: '4px 0',
                            borderBottom: idx < uidLines.length - 1 ? '1px dashed #e0e0e0' : 'none'
                        } }, line))))),
                status === 'confirmed' && (React.createElement("div", { style: {
                        width: '100%',
                        background: '#faf8f4',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        border: '1px solid #e8d5b0'
                    } },
                    React.createElement("div", { style: { fontSize: '13px', fontWeight: 'bold', color: '#8b6d3f', marginBottom: '6px' } }, "\u53EF\u7528\u6307\u4EE4"),
                    React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } }, ['#原神签到', '#星铁签到', '#米游社签到', '#体力', '#深渊', '#我的stoken'].map((cmd, idx) => (React.createElement("span", { key: idx, style: {
                            background: '#e8d5b0',
                            color: '#4a3a20',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        } }, cmd)))))),
                status === 'expired' && (React.createElement("div", { style: { fontSize: '13px', color: '#877254', textAlign: 'center' } },
                    "\u8BF7\u91CD\u65B0\u53D1\u9001 ",
                    React.createElement("span", { style: { fontWeight: 'bold', color: '#8b6d3f' } }, "#\u626B\u7801\u767B\u5F55"),
                    " \u83B7\u53D6\u65B0\u7684\u4E8C\u7EF4\u7801"))),
            React.createElement("div", { style: {
                    marginTop: '12px',
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#b0a18a',
                    lineHeight: '1.6',
                    textAlign: 'center'
                } },
                "\u26A0\uFE0F \u4EC5\u7528\u4E8E\u7C73\u6E38\u793E\u67E5\u8BE2\u53CA\u6E38\u620F\u670D\u52A1 \u00B7 \u5F00\u53D1\u8005\u4E0D\u4F1A\u4FDD\u5B58\u767B\u5F55\u72B6\u6001",
                React.createElement("br", null),
                "\u8D26\u53F7\u5B89\u5168\u95EE\u9898\u4E0E\u5F00\u53D1\u8005\u65E0\u5173 \u00B7 Powered by alemonjs"))));
}

export { QrLoginCard as default };
