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
  cookieAccept: /(ltoken|ltoken_v2).*(ltuid|login_uid|ltmid_v2)/,
  dailyNote: /^(!|！|\/|#|＃)*(原神|星铁|绝区零)?(体力|树脂|查询体力|开拓力|电量)$/,
  playerIndex: /^(!|！|\/|#|＃)(原神|星铁|绝区零)?(角色|面板)$/,
  spiralAbyss: /^(!|！|\/|#|＃)(原神|星铁)?(上期|往期|本期)*(深渊|深境|深境螺旋|忘却之庭|虚构叙事)(上期|往期|本期)*$/,
  roleExplore: /^(!|！|\/|#|＃)(原神|星铁|绝区零)?(宝箱|成就|尘歌壶|家园|探索|探险|声望|探险度|探索度)\s*\d*$/,
  weapon: /^(!|！|\/|#|＃)(原神)?(五星|四星|5星|4星)*武器\s*\d*$/,
  buddy: /^(!|！|\/|#|＃)(绝区零)?邦布$/,
  roleCombat: /^(!|！|\/|#|＃)(幻想真境剧诗|剧诗)$/,
  ledger: /^(!|！|\/|#|＃)(原神|星铁)?(原石|星琼|札记)\s*(\d{1,2}月?|[一二三四五六七八九十]+月?)?$/,
  exchange: /^(!|！|\/|#|＃)(原神|星铁|绝区零)?兑换码$/,
  mysNews: /^(!|！|\/|#|＃)(原神|星铁|绝区零|崩坏三|崩三)?(公告|资讯|活动)(列表)?\s*\d*$/,
  ckHelp: /^(!|！|\/|#|＃)(ck|cookie)(帮助|说明|教程)$/i,
  ckCheck: /^(!|！|\/|#|＃)(检查|验证|测试)c(oo)?k(ie)?$/i
} as const;
