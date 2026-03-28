import React from 'react';
import HTML from './HTML.js';

/** 指令条目 */
interface CmdItem {
  /** 图标 emoji */
  icon: string;
  /** 指令文本 */
  cmd: string;
  /** 简要说明 */
  desc: string;
}

/** 帮助分类 */
interface HelpCategory {
  title: string;
  items: CmdItem[];
}

/** 米游社帮助分类 — 参照 Miao-Yunzai help.yaml 布局 */
const MHY_HELP: HelpCategory[] = [
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

/** 总页数（不分页，一页展示全部） */
export const MHY_TOTAL_PAGES = 1;

/** 组件 Props */
interface MihoyoHelpProps {
  data?: { page?: number; totalPages?: number };
}

export default function MihoyoHelp({ data: _data }: MihoyoHelpProps) {
  return (
    <HTML>
      <div
        style={{
          padding: '15px',
          background: '#f5f6fb',
          fontFamily: '"tttgbnumber", system-ui, sans-serif',
          fontSize: '16px',
          color: '#1e1f20'
        }}
      >
        {/* ═══ 标题卡 ═══ */}
        <div
          style={{
            background: 'linear-gradient(135deg, #e8d5b0, #d3bc8e)',
            borderRadius: '15px',
            padding: '14px 20px',
            marginBottom: '12px',
            boxShadow: '0 5px 10px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '26px' }}>🎮</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#4a3a20' }}>米游社 · 指令帮助</span>
          </div>
          <span style={{ fontSize: '13px', color: '#6b5838' }}>Powered by alemonjs</span>
        </div>

        {/* ═══ 分类列表 ═══ */}
        {MHY_HELP.map((cat, ci) => (
          <div
            key={ci}
            style={{
              background: '#fff',
              borderRadius: '15px',
              marginBottom: '12px',
              boxShadow: '0 5px 10px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
          >
            {/* — 分类标题栏 — */}
            <div
              style={{
                background: 'linear-gradient(90deg, #d3bc8e, #e8d5b0)',
                padding: '8px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '18px',
                  background: '#8b6d3f',
                  borderRadius: '2px'
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#4a3a20' }}>{cat.title}</span>
            </div>

            {/* — 指令条目 — */}
            <div style={{ padding: '6px 12px' }}>
              {cat.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 4px',
                    borderBottom: idx < cat.items.length - 1 ? '1px dashed #e5e5e5' : 'none'
                  }}
                >
                  {/* 图标 */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#f5f0e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </div>
                  {/* 指令+说明 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e1f20' }}>{item.cmd}</div>
                    <div style={{ fontSize: '12px', color: '#877254', marginTop: '1px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ═══ 底部 ═══ */}
        <div
          style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '10px 15px',
            boxShadow: '0 5px 10px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '12px', color: '#877254' }}>💡 指令前缀支持 # ! / · 可加游戏名前缀</span>
          <span style={{ fontSize: '12px', color: '#b0a18a' }}>#ck帮助 查看绑定教程</span>
        </div>
      </div>
    </HTML>
  );
}
