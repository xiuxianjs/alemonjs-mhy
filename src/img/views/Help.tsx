import imgEquipment from '@src/assets/img/32.png';
import { BackgroundImage } from 'jsxp';
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
  intro: string;
  items: CmdItem[];
}

/** 全部帮助分类 */
export const HELP_CATEGORIES: HelpCategory[] = [
  {
    icon: '🏠',
    title: '基础入门',
    intro: '新手第一步，了解世界与自身',
    items: [
      { cmd: '/我', desc: '打开主页，查看角色概览' },
      { cmd: '/踏入仙途', desc: '创建角色，开始修仙之旅' },
      { cmd: '/帮助', desc: '显示本帮助图' },
      { cmd: '/关于游戏', desc: '游戏介绍与版本信息' },
      { cmd: '/公告', desc: '查看游戏公告列表' },
      { cmd: '/更多', desc: '更多扩展功能入口' },
      { cmd: '/折叠', desc: '查看更多功能指令' },
      { cmd: '/我的活动', desc: '活动玩法入口' }
    ]
  },
  {
    icon: '⚔️',
    title: '修炼体系',
    intro: '提升境界、积蓄修为',
    items: [
      { cmd: '/突破', desc: '小境界突破' },
      { cmd: '/晋级', desc: '大境界晋级，需要突破材料' },
      { cmd: '/打坐', desc: '开始打坐获取修为' },
      { cmd: '/打坐结束', desc: '结束打坐结算收益' },
      { cmd: '/冲脉', desc: '消耗精力冲击脉络' },
      { cmd: '/经络', desc: '查看经络状态' },
      { cmd: '/闭关', desc: '查看闭关选项或进度' },
      { cmd: '/闭关 N', desc: '开始N小时闭关(48/72/96，12需令)' },
      { cmd: '/出关', desc: '结束闭关结算奖励' },
      { cmd: '/属性面板', desc: '查看详细属性面板' }
    ]
  },
  {
    icon: '🗡️',
    title: '副本战斗',
    intro: '挑战秘境、主线及妖塔',
    items: [
      { cmd: '/查看秘境', desc: '浏览可进入的秘境' },
      { cmd: '/进入秘境 X', desc: '进入指定秘境探索' },
      { cmd: '/扫荡秘境 X', desc: '快速扫荡已通关秘境' },
      { cmd: '/查看主线', desc: '主线章节总览' },
      { cmd: '/主线挑战 X-Y', desc: '挑战第X章第Y关' },
      { cmd: '/妖塔', desc: '查看妖塔进度与选项' },
      { cmd: '/妖塔挑战 N', desc: '挑战妖塔（1/2/3难度）' },
      { cmd: '/比试 ID', desc: '与指定玩家切磋' },
      { cmd: '/附近道友', desc: '查看可切磋的NPC' },
      { cmd: '/打劫 ID', desc: '打劫其他玩家' }
    ]
  },
  {
    icon: '🎒',
    title: '物品装备',
    intro: '管理储物袋、装备与功法',
    items: [
      { cmd: '/储物袋', desc: '查看所有物品总览' },
      { cmd: '/储物袋 道具', desc: '按类型筛选物品' },
      { cmd: '/我的装备', desc: '查看已穿戴装备' },
      { cmd: '/装备 XX', desc: '穿戴指定装备' },
      { cmd: '/卸下 XX', desc: '卸下指定装备' },
      { cmd: '/服用 XX N', desc: '使用N个丹药/物品' },
      { cmd: '/我的功法', desc: '查看已学功法' },
      { cmd: '/学习功法 ID', desc: '学习指定功法' },
      { cmd: '/悟道 ID', desc: '功法悟道提升' },
      { cmd: '/物品详情 类型 ID', desc: '查看物品详细信息' }
    ]
  },
  {
    icon: '🔥',
    title: '炼丹炼器',
    intro: '丹道、器道双修之路',
    items: [
      { cmd: '/炼丹师', desc: '查看炼丹师信息' },
      { cmd: '/丹方', desc: '浏览已学丹方列表' },
      { cmd: '/炼制 丹方名', desc: '开始炼制指定丹药' },
      { cmd: '/一键炼丹 丹方名', desc: '自动炼制直到材料耗尽' },
      { cmd: '/炼丹进阶', desc: '炼丹等级进阶' },
      { cmd: '/炼器', desc: '查看炼器信息或炼制装备' },
      { cmd: '/我的器谱', desc: '浏览已学器谱' },
      { cmd: '/学习器谱 XX', desc: '学习新器谱' }
    ]
  },
  {
    icon: '🏪',
    title: '商店系统',
    intro: '各类商店消费与兑换',
    items: [
      { cmd: '/万宝楼', desc: '综合商店（灵石/灵晶/道晶）' },
      { cmd: '/签到商店', desc: '签到币兑换商品' },
      { cmd: '/积分商城', desc: '妖塔积分兑换' },
      { cmd: '/神奇商店', desc: '道晶灵晶购买稀有物品' },
      { cmd: '/声望商店', desc: '声望兑换专属商品' },
      { cmd: '/道侣商店', desc: '同心值兑换道侣物品' },
      { cmd: '/商店购买 编号', desc: '购买指定商品' }
    ]
  },
  {
    icon: '💹',
    title: '玩家交易',
    intro: '与其他玩家自由交易',
    items: [
      { cmd: '/交易所', desc: '浏览全服在售物品' },
      { cmd: '/交易上架 类型', desc: '将物品上架出售' },
      { cmd: '/交易购买 XX', desc: '购买交易所物品' },
      { cmd: '/我的上架', desc: '查看自己上架中的商品' },
      { cmd: '/交易下架 ID', desc: '下架指定商品' },
      { cmd: '/我的交易记录', desc: '查看买卖历史' }
    ]
  },
  {
    icon: '🏯',
    title: '宗门玩法',
    intro: '加入宗门，共同发展',
    items: [
      { cmd: '/我的宗门', desc: '查看宗门信息' },
      { cmd: '/宗门列表', desc: '浏览可加入的宗门' },
      { cmd: '/加入宗门 ID', desc: '申请加入指定宗门' },
      { cmd: '/宗门签到', desc: '每日宗门签到' },
      { cmd: '/宗门日常', desc: '查看宗门任务' },
      { cmd: '/宗门商店', desc: '宗门贡献兑换' },
      { cmd: '/宗门采矿', desc: '采矿获取矿石' },
      { cmd: '/宗门大比', desc: '宗门间PVP大赛' },
      { cmd: '/秘境攻防', desc: '秘境攻防战，占领可提升产量' }
    ]
  },
  {
    icon: '👥',
    title: '社交系统',
    intro: '结交好友、寻觅道侣',
    items: [
      { cmd: '/结交 UID', desc: '向玩家发送好友申请' },
      { cmd: '/我的好友', desc: '查看我的好友' },
      { cmd: '/好友申请', desc: '处理待处理的申请' },
      { cmd: '/我的道侣', desc: '查看道侣状态' },
      { cmd: '/结为道侣 UID', desc: '向玩家求婚' },
      { cmd: '/双修', desc: '与道侣双修获取收益' },
      { cmd: '/创建队伍', desc: '创建副本队伍' },
      { cmd: '/我的队伍', desc: '查看当前队伍' }
    ]
  },
  {
    icon: '📅',
    title: '每日任务',
    intro: '签到打卡，积累奖励',
    items: [
      { cmd: '/日常签到', desc: '每日签到获取奖励' },
      { cmd: '/新人签到', desc: '新手专属连续签到' },
      { cmd: '/登仙台签到', desc: '登仙台每日打卡' },
      { cmd: '/日常活跃', desc: '查看日常活跃任务' },
      { cmd: '/周常活跃', desc: '查看周常活跃任务' },
      { cmd: '/我的成就', desc: '查看解锁的成就' }
    ]
  },
  {
    icon: '🏆',
    title: '排行奖励',
    intro: '排名竞技，领取丰厚奖励',
    items: [
      { cmd: '/排行榜', desc: '查看所有排行榜入口' },
      { cmd: '/通天塔', desc: '爬塔排名与挑战' },
      { cmd: '/战力排行榜', desc: '全服战力排名' },
      { cmd: '/境界排行榜', desc: '按境界与修为排名' },
      { cmd: '/挑战排名 位次', desc: '挑战指定排名玩家' },
      { cmd: '/新人狂欢', desc: '新人限时奖励' },
      { cmd: '/里程碑', desc: '世界里程碑进度' }
    ]
  },
  {
    icon: '⚙️',
    title: '系统功能',
    intro: '配置、邮件与账号管理',
    items: [
      { cmd: '/我的邮件', desc: '查看系统邮件' },
      { cmd: '/我的反馈', desc: '查看已提交的反馈' },
      { cmd: '/反馈 内容', desc: '提交游戏建议或BUG' },
      { cmd: '/我的设置', desc: '查看/切换秘境模式等设置' },
      { cmd: '/安全中心', desc: '绑定邮箱/账号管理' },
      { cmd: '/改名 新名字', desc: '修改角色道号' },
      { cmd: '/我的权益', desc: '查看月卡等权益状态' },
      { cmd: '/月卡领取', desc: '一键领取月卡每日奖励' },
      { cmd: '/充值', desc: '查看充值套餐与VIP说明' }
    ]
  }
];

/** 每页显示的分类数 */
export const PAGE_SIZE = 3;
/** 总页数 */
export const TOTAL_PAGES = Math.ceil(HELP_CATEGORIES.length / PAGE_SIZE);

/* ── 样式常量 ─────────────────────────── */
const C = {
  panelBg: 'rgba(8, 18, 48, 0.92)',
  cardBg: 'rgba(22, 45, 85, 0.72)',
  cardBorder: 'rgba(70, 145, 210, 0.22)',
  catHeadBg: 'rgba(30, 65, 120, 0.55)',
  headerGrad: 'linear-gradient(135deg, rgba(25, 55, 110, 0.95), rgba(15, 70, 130, 0.9))',
  headerBorder: 'rgba(100, 200, 255, 0.4)',
  cyan: '#7dd3fc',
  textSec: '#94a3b8',
  cmdBg: 'rgba(45, 90, 150, 0.45)',
  cmdBorder: 'rgba(80, 160, 220, 0.18)',
  footerBg: 'rgba(10, 22, 50, 0.85)',
  dotActive: 'rgba(125, 211, 252, 0.9)',
  dotInactive: 'rgba(125, 211, 252, 0.25)'
};

/** 组件 Props */
interface HelpProps {
  data?: { page?: number; totalPages?: number };
}

export default function Help({ data }: HelpProps) {
  const { page = 1, totalPages = TOTAL_PAGES } = data ?? {};
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageCats = HELP_CATEGORIES.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <HTML>
      <BackgroundImage className='px-3 py-3' id='root' data-theme='dark' src={imgEquipment}>
        {/* ═══ 标题栏 ═══ */}
        <div
          className='rounded-t-lg px-5 py-3 flex items-center justify-between'
          style={{ background: C.headerGrad, borderBottom: `2px solid ${C.headerBorder}` }}
        >
          <div className='flex items-center gap-2'>
            <span style={{ fontSize: '28px' }}>📜</span>
            <span className='font-bold tracking-wider' style={{ fontSize: '24px', color: '#fff', textShadow: '0 1px 6px rgba(100,200,255,0.4)' }}>
              陨星大陆 · 指令大全
            </span>
          </div>
          {/* 页码圆点指示器 */}
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

        {/* ═══ 单列分类列表 ═══ */}
        <div
          className='px-3 py-2'
          style={{
            background: C.panelBg,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {pageCats.map((cat, ci) => (
            <div key={ci} className='rounded-lg overflow-hidden' style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              {/* — 分类标题 — */}
              <div className='px-3 py-2 flex items-center justify-between' style={{ background: C.catHeadBg, borderBottom: `1px solid ${C.cardBorder}` }}>
                <div className='flex items-center gap-1.5'>
                  <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                  <span className='font-bold' style={{ fontSize: '18px', color: C.cyan }}>
                    {cat.title}
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: C.textSec }}>{cat.intro}</span>
              </div>

              {/* — 指令列表（指令左·说明右） — */}
              <div className='px-3 py-2' style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '2px 0',
                      borderBottom: idx < cat.items.length - 1 ? `1px dashed ${C.cmdBorder}` : 'none'
                    }}
                  >
                    <span
                      className='rounded px-1.5 py-0.5'
                      style={{
                        fontSize: '15px',
                        color: '#fff',
                        background: C.cmdBg,
                        border: `1px solid ${C.cmdBorder}`,
                        fontFamily: 'monospace, "tttgbnumber"',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        minWidth: '140px'
                      }}
                    >
                      {item.cmd}
                    </span>
                    <span style={{ fontSize: '14px', color: C.textSec }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ 底部 ═══ */}
        <div className='rounded-b-lg px-4 py-2 flex items-center justify-between' style={{ background: C.footerBg, borderTop: `1px solid ${C.cardBorder}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '13px', color: C.cyan }}>💡 指令前缀可用 / ! # · 参数用空格分隔</span>
            <span style={{ fontSize: '12px', color: C.textSec }}>发送 /帮助 N 翻页 · 输入 /我 开始游戏</span>
          </div>
          <span className='font-bold' style={{ fontSize: '16px', color: C.cyan }}>
            {page} / {totalPages}
          </span>
        </div>
      </BackgroundImage>
    </HTML>
  );
}
