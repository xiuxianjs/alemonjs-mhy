import React from 'react';
import HTML from './HTML.js';

const MHY_HELP = [
    {
        title: '账号绑定',
        items: [
            { icon: '🔑', cmd: '#绑定ck', desc: '绑定米游社Cookie（私聊发送）' },
            { icon: '🎯', cmd: '#绑定uid', desc: '手动绑定游戏UID' },
            { icon: '📋', cmd: '#我的uid', desc: '查看已绑定的UID列表' },
            { icon: '🍪', cmd: '#我的ck', desc: '查看Cookie绑定状态' },
            { icon: '🗑️', cmd: '#删除ck / #删除uid', desc: '删除Cookie或解除UID绑定' },
            { icon: '❓', cmd: '#ck帮助', desc: 'Cookie获取教程' },
            { icon: '✅', cmd: '#检查ck', desc: '验证Cookie是否有效' }
        ]
    },
    {
        title: '原神查询指令',
        items: [
            { icon: '👤', cmd: '#角色', desc: '角色面板概览（等级/命座）' },
            { icon: '🗺️', cmd: '#探索', desc: '宝箱·神瞳·世界探索度' },
            { icon: '⚔️', cmd: '#深渊 / #上期深渊', desc: '深境螺旋数据' },
            { icon: '🗡️', cmd: '#武器 / #五星武器', desc: '武器列表与装备情况' },
            { icon: '🌿', cmd: '#体力 / #树脂', desc: '实时树脂与每日委托' },
            { icon: '💎', cmd: '#原石 / #札记', desc: '原石收入月度统计' },
            { icon: '🎭', cmd: '#剧诗', desc: '幻想真境剧诗阵容' }
        ]
    },
    {
        title: '星穹铁道',
        items: [
            { icon: '🚄', cmd: '#星铁角色', desc: '角色面板与星魂等级' },
            { icon: '⚡', cmd: '#星铁体力', desc: '开拓力与委托状态' },
            { icon: '🌀', cmd: '#星铁深渊', desc: '忘却之庭/虚构叙事' },
            { icon: '✨', cmd: '#星琼', desc: '星琼收入月度统计' }
        ]
    },
    {
        title: '绝区零',
        items: [
            { icon: '📺', cmd: '#绝区零角色', desc: '代理人面板数据' },
            { icon: '🔋', cmd: '#绝区零体力', desc: '电量与活跃度' },
            { icon: '🐾', cmd: '#邦布', desc: '邦布收集列表' }
        ]
    },
    {
        title: '其他指令',
        items: [
            { icon: '📰', cmd: '#公告 / #资讯 / #活动', desc: '米游社官方资讯' },
            { icon: '🎁', cmd: '#兑换码', desc: '查询直播兑换码' },
            { icon: '📖', cmd: '#米游社帮助', desc: '查看本帮助图' },
            { icon: '📊', cmd: '#米游社状态', desc: '模块运行状态' }
        ]
    }
];
const MHY_TOTAL_PAGES = 1;
function MihoyoHelp({ data: _data }) {
    return (React.createElement(HTML, null,
        React.createElement("div", { style: {
                padding: '15px',
                background: '#f5f6fb',
                fontFamily: '"tttgbnumber", system-ui, sans-serif',
                fontSize: '16px',
                color: '#1e1f20'
            } },
            React.createElement("div", { style: {
                    background: 'linear-gradient(135deg, #e8d5b0, #d3bc8e)',
                    borderRadius: '15px',
                    padding: '14px 20px',
                    marginBottom: '12px',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                } },
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement("span", { style: { fontSize: '26px' } }, "\uD83C\uDFAE"),
                    React.createElement("span", { style: { fontSize: '22px', fontWeight: 'bold', color: '#4a3a20' } }, "\u7C73\u6E38\u793E \u00B7 \u6307\u4EE4\u5E2E\u52A9")),
                React.createElement("span", { style: { fontSize: '13px', color: '#6b5838' } }, "Powered by alemonjs")),
            MHY_HELP.map((cat, ci) => (React.createElement("div", { key: ci, style: {
                    background: '#fff',
                    borderRadius: '15px',
                    marginBottom: '12px',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                } },
                React.createElement("div", { style: {
                        background: 'linear-gradient(90deg, #d3bc8e, #e8d5b0)',
                        padding: '8px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    } },
                    React.createElement("div", { style: {
                            width: '4px',
                            height: '18px',
                            background: '#8b6d3f',
                            borderRadius: '2px'
                        } }),
                    React.createElement("span", { style: { fontSize: '16px', fontWeight: 'bold', color: '#4a3a20' } }, cat.title)),
                React.createElement("div", { style: { padding: '6px 12px' } }, cat.items.map((item, idx) => (React.createElement("div", { key: idx, style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 4px',
                        borderBottom: idx < cat.items.length - 1 ? '1px dashed #e5e5e5' : 'none'
                    } },
                    React.createElement("div", { style: {
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: '#f5f0e8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            flexShrink: 0
                        } }, item.icon),
                    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        React.createElement("div", { style: { fontSize: '14px', fontWeight: 'bold', color: '#1e1f20' } }, item.cmd),
                        React.createElement("div", { style: { fontSize: '12px', color: '#877254', marginTop: '1px' } }, item.desc))))))))),
            React.createElement("div", { style: {
                    background: '#fff',
                    borderRadius: '15px',
                    padding: '10px 15px',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                } },
                React.createElement("span", { style: { fontSize: '12px', color: '#877254' } }, "\uD83D\uDCA1 \u6307\u4EE4\u524D\u7F00\u652F\u6301 # ! / \u00B7 \u53EF\u52A0\u6E38\u620F\u540D\u524D\u7F00"),
                React.createElement("span", { style: { fontSize: '12px', color: '#b0a18a' } }, "#ck\u5E2E\u52A9 \u67E5\u770B\u7ED1\u5B9A\u6559\u7A0B")))));
}

export { MHY_TOTAL_PAGES, MihoyoHelp as default };
