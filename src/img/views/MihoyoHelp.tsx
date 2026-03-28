import React from 'react';
import HTML from './HTML.js';

/** 指令条目 */
interface CmdItem {
  /** 指令文本 */
  cmd: string;
  /** 简要说明 */
  desc: string;
}

/** 帮助分类 */
interface HelpCategory {
  icon: string;
  title: string;
  items: CmdItem[];
}

/** 米游社帮助分类 — 参照 Miao-Yunzai help.yaml */
const MHY_HELP: HelpCategory[] = [
  {
    icon: '🔑',
    title: '账号绑定',
    items: [
      { cmd: '#绑定ck', desc: '绑定米游社Cookie（私聊发送）' },
      { cmd: '#绑定uid <UID>', desc: '手动绑定游戏UID' },
      { cmd: '#我的uid', desc: '查看已绑定的UID列表' },
      { cmd: '#我的ck', desc: '查看Cookie绑定状态' },
      { cmd: '#删除ck', desc: '删除已绑定的Cookie' },
      { cmd: '#删除uid', desc: '解除UID绑定' },
      { cmd: '#ck帮助', desc: 'Cookie获取教程' },
      { cmd: '#检查ck', desc: '验证Cookie是否有效' }
    ]
  },
  {
    icon: '⚔️',
    title: '原神查询',
    items: [
      { cmd: '#角色', desc: '角色面板概览（等级/命座）' },
      { cmd: '#探索', desc: '宝箱·神瞳·世界探索度' },
      { cmd: '#深渊 / #上期深渊', desc: '深境螺旋数据' },
      { cmd: '#武器 / #五星武器', desc: '武器列表与装备情况' },
      { cmd: '#体力 / #树脂', desc: '实时树脂与每日委托' },
      { cmd: '#原石 / #札记', desc: '原石收入月度统计' },
      { cmd: '#剧诗', desc: '幻想真境剧诗阵容' }
    ]
  },
  {
    icon: '🚄',
    title: '星穹铁道',
    items: [
      { cmd: '#星铁角色', desc: '角色面板与星魂等级' },
      { cmd: '#星铁体力', desc: '开拓力与委托状态' },
      { cmd: '#星铁深渊', desc: '忘却之庭/虚构叙事' },
      { cmd: '#星琼', desc: '星琼收入月度统计' }
    ]
  },
  {
    icon: '📺',
    title: '绝区零',
    items: [
      { cmd: '#绝区零角色', desc: '代理人面板数据' },
      { cmd: '#绝区零体力', desc: '电量与活跃度' },
      { cmd: '#邦布', desc: '邦布收集列表' }
    ]
  },
  {
    icon: '📰',
    title: '资讯工具',
    items: [
      { cmd: '#公告 / #资讯 / #活动', desc: '米游社官方资讯' },
      { cmd: '#兑换码', desc: '查询直播兑换码' },
      { cmd: '#米游社帮助', desc: '查看迁移模块说明' },
      { cmd: '#米游社状态', desc: '模块运行状态' }
    ]
  }
];

/** 每页分类数 */
const PAGE_SIZE = 3;

/** 总页数 */
export const MHY_TOTAL_PAGES = Math.ceil(MHY_HELP.length / PAGE_SIZE);

/* ── 主题色 ─────────────────────────── */
const C = {
  panelBg: 'rgba(6, 14, 36, 0.94)',
  cardBg: 'rgba(18, 38, 72, 0.75)',
  cardBorder: 'rgba(60, 130, 200, 0.22)',
  catHeadBg: 'rgba(25, 55, 105, 0.6)',
  headerGrad: 'linear-gradient(135deg, rgba(20, 45, 95, 0.96), rgba(10, 60, 120, 0.92))',
  headerBorder: 'rgba(80, 180, 240, 0.45)',
  amber: '#fbbf24',
  cyan: '#7dd3fc',
  textPri: '#e2e8f0',
  textSec: '#94a3b8',
  cmdBg: 'rgba(40, 80, 140, 0.5)',
  cmdBorder: 'rgba(70, 150, 210, 0.2)',
  footerBg: 'rgba(8, 18, 42, 0.88)',
  dotActive: 'rgba(251, 191, 36, 0.9)',
  dotInactive: 'rgba(251, 191, 36, 0.25)',
  tagBg: 'rgba(251, 191, 36, 0.15)',
  tagBorder: 'rgba(251, 191, 36, 0.35)'
};

/** 组件 Props */
interface MihoyoHelpProps {
  data?: { page?: number; totalPages?: number };
}

export default function MihoyoHelp({ data }: MihoyoHelpProps) {
  const { page = 1, totalPages = MHY_TOTAL_PAGES } = data ?? {};
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageCats = MHY_HELP.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <HTML>
      <div className='px-3 py-3' id='root' data-theme='dark' style={{ background: '#0a1628', minWidth: '520px' }}>
        {/* ═══ 标题栏 ═══ */}
        <div
          className='rounded-t-lg px-5 py-3 flex items-center justify-between'
          style={{ background: C.headerGrad, borderBottom: `2px solid ${C.headerBorder}` }}
        >
          <div className='flex items-center gap-2'>
            <span style={{ fontSize: '26px' }}>🎮</span>
            <span className='font-bold tracking-wider' style={{ fontSize: '22px', color: C.amber, textShadow: '0 1px 8px rgba(251,191,36,0.35)' }}>
              米游社 · 指令帮助
            </span>
          </div>
          {/* 页码指示器 */}
          <div className='flex items-center gap-1'>
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: i + 1 === page ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i + 1 === page ? C.dotActive : C.dotInactive
                }}
              />
            ))}
          </div>
        </div>

        {/* ═══ 分类列表 ═══ */}
        <div className='px-3 py-2' style={{ background: C.panelBg, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pageCats.map((cat, ci) => (
            <div key={ci} className='rounded-lg overflow-hidden' style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              {/* 分类标题 */}
              <div className='px-3 py-2 flex items-center gap-2' style={{ background: C.catHeadBg, borderBottom: `1px solid ${C.cardBorder}` }}>
                <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                <span className='font-bold' style={{ fontSize: '17px', color: C.amber }}>
                  {cat.title}
                </span>
                <span
                  className='rounded-full px-2 py-0.5'
                  style={{ fontSize: '11px', color: C.amber, background: C.tagBg, border: `1px solid ${C.tagBorder}` }}
                >
                  {cat.items.length} 条
                </span>
              </div>

              {/* 指令行 */}
              <div className='px-3 py-2' style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '3px 0',
                      borderBottom: idx < cat.items.length - 1 ? `1px dashed ${C.cmdBorder}` : 'none'
                    }}
                  >
                    <span
                      className='rounded px-1.5 py-0.5'
                      style={{
                        fontSize: '14px',
                        color: '#fff',
                        background: C.cmdBg,
                        border: `1px solid ${C.cmdBorder}`,
                        fontFamily: 'monospace, "tttgbnumber"',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        minWidth: '170px'
                      }}
                    >
                      {item.cmd}
                    </span>
                    <span style={{ fontSize: '13px', color: C.textSec }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ 底部 ═══ */}
        <div className='rounded-b-lg px-4 py-2 flex items-center justify-between' style={{ background: C.footerBg, borderTop: `1px solid ${C.cardBorder}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '12px', color: C.cyan }}>💡 指令前缀支持 # ! / · 可加游戏名前缀如 #原神体力 #星铁深渊</span>
            <span style={{ fontSize: '11px', color: C.textSec }}>发送 #米游社帮助 N 翻页 · #ck帮助 查看绑定教程</span>
          </div>
          <span className='font-bold' style={{ fontSize: '15px', color: C.amber }}>
            {page} / {totalPages}
          </span>
        </div>
      </div>
    </HTML>
  );
}
