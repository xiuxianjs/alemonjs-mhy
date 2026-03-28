export const mihoyoConstants = {
  commandPrefixPattern: '(!|！|/|#|＃)',
  games: {
    gs: { key: 'gs', name: '原神' },
    sr: { key: 'sr', name: '星穹铁道' },
    zzz: { key: 'zzz', name: '绝区零' }
  },
  ckMaskKeepLength: 6,
  requestTimeoutMs: 10000,
  cacheSeconds: 300
} as const;

export const mihoyoRouteRules = {
  help: /^(!|！|\/|#|＃)(米游社|mihoyo)(帮助|迁移|模块)$/,
  status: /^(!|！|\/|#|＃)(米游社|mihoyo)(状态|status)$/,
  bindCk: /^(!|！|\/|#|＃)绑定c(oo)?k(ie)?$/i,
  bindUid: /^(!|！|\/|#|＃)(原神|星铁|绝区零)?绑定(uid)?(\s|\+)*((1[0-9]|[1-9])[0-9]{8}|[1-9][0-9]{7})$/i,
  showUid: /^(!|！|\/|#|＃)(原神|星铁|绝区零)?(我的)?(uid)\d{0,2}$/i,
  myCk: /^(!|！|\/|#|＃)(原神|星铁|绝区零)?(我的|删除)c(oo)?k(ie)?$/i,
  delUid: /^(!|！|\/|#|＃)(原神|星铁|绝区零)?(删除|解绑)uid(\s|\+)*(\d{1,2})?$/i,
  cookieAccept: /(ltoken|ltoken_v2).*(ltuid|login_uid|ltmid_v2)/
} as const;

export const mihoyoMigrationPhases = [
  'phase-1: 路由与目录骨架',
  'phase-2: 账号与Cookie绑定',
  'phase-3: 基础查询（体力/角色/深渊）',
  'phase-4: 抽卡与充值数据链路',
  'phase-5: 公告推送与任务调度'
] as const;
