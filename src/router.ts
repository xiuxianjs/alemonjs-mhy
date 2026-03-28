import { mihoyoRouteRules } from '@src/constants/mihoyo';
import { defineRouter, lazy } from 'alemonjs';

export default defineRouter([
  {
    // 局部中间件
    handler: lazy(() => import('@src/response/mw')),
    children: [
      {
        regular: mihoyoRouteRules.help,
        handler: lazy(() => import('@src/response/mihoyo/help'))
      },
      {
        regular: mihoyoRouteRules.bindCk,
        handler: lazy(() => import('@src/response/mihoyo/bindCk'))
      },
      {
        regular: mihoyoRouteRules.cookieAccept,
        handler: lazy(() => import('@src/response/mihoyo/bindCk'))
      },
      {
        regular: mihoyoRouteRules.bindUid,
        handler: lazy(() => import('@src/response/mihoyo/bindUid'))
      },
      {
        regular: mihoyoRouteRules.showUid,
        handler: lazy(() => import('@src/response/mihoyo/showUid'))
      },
      {
        regular: mihoyoRouteRules.myCk,
        handler: lazy(() => import('@src/response/mihoyo/myCk'))
      },
      {
        regular: mihoyoRouteRules.delUid,
        handler: lazy(() => import('@src/response/mihoyo/delUid'))
      },
      {
        regular: mihoyoRouteRules.dailyNote,
        handler: lazy(() => import('@src/response/mihoyo/dailyNote'))
      },
      {
        regular: mihoyoRouteRules.playerIndex,
        handler: lazy(() => import('@src/response/mihoyo/playerIndex'))
      },
      {
        regular: mihoyoRouteRules.spiralAbyss,
        handler: lazy(() => import('@src/response/mihoyo/spiralAbyss'))
      },
      {
        regular: mihoyoRouteRules.roleExplore,
        handler: lazy(() => import('@src/response/mihoyo/roleExplore'))
      },
      {
        regular: mihoyoRouteRules.weapon,
        handler: lazy(() => import('@src/response/mihoyo/weapon'))
      },
      {
        regular: mihoyoRouteRules.buddy,
        handler: lazy(() => import('@src/response/mihoyo/buddy'))
      },
      {
        regular: mihoyoRouteRules.roleCombat,
        handler: lazy(() => import('@src/response/mihoyo/roleCombat'))
      },
      {
        regular: mihoyoRouteRules.ledger,
        handler: lazy(() => import('@src/response/mihoyo/ledger'))
      },
      {
        regular: mihoyoRouteRules.exchange,
        handler: lazy(() => import('@src/response/mihoyo/exchange'))
      },
      {
        regular: mihoyoRouteRules.mysNews,
        handler: lazy(() => import('@src/response/mihoyo/mysNews'))
      },
      {
        regular: mihoyoRouteRules.ckHelp,
        handler: lazy(() => import('@src/response/mihoyo/ckHelp'))
      },
      {
        regular: mihoyoRouteRules.ckCheck,
        handler: lazy(() => import('@src/response/mihoyo/ckCheck'))
      },
      // ─── stoken ──────────────────────────────────
      {
        regular: mihoyoRouteRules.bindStoken,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      {
        regular: mihoyoRouteRules.stokenAccept,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      {
        regular: mihoyoRouteRules.myStoken,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      {
        regular: mihoyoRouteRules.delStoken,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      // ─── 签到 ────────────────────────────────────
      {
        regular: mihoyoRouteRules.gameSign,
        handler: lazy(() => import('@src/response/mihoyo/gameSign'))
      },
      {
        regular: mihoyoRouteRules.bbsSign,
        handler: lazy(() => import('@src/response/mihoyo/bbsSign'))
      },
      // ─── 扫码登录 ────────────────────────────────
      {
        regular: mihoyoRouteRules.qrLogin,
        handler: lazy(() => import('@src/response/mihoyo/qrLogin'))
      },
      // ─── 兑换码使用 ──────────────────────────────
      {
        regular: mihoyoRouteRules.useCode,
        handler: lazy(() => import('@src/response/mihoyo/useCode'))
      },
      // ─── 七圣召唤 ────────────────────────────────
      {
        regular: mihoyoRouteRules.sevenSaints,
        handler: lazy(() => import('@src/response/mihoyo/sevenSaints'))
      },
      // ─── 留影叙佳期 ──────────────────────────────
      {
        regular: mihoyoRouteRules.birthday,
        handler: lazy(() => import('@src/response/mihoyo/birthday'))
      },
      // ─── 充值记录 ────────────────────────────────
      {
        regular: mihoyoRouteRules.payLog,
        handler: lazy(() => import('@src/response/mihoyo/payLog'))
      },
      {
        regular: mihoyoRouteRules.payLogAuth,
        handler: lazy(() => import('@src/response/mihoyo/payLog'))
      }
    ]
  }
]);
