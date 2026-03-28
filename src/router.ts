import { mihoyoRouteRules } from '@src/constants/mihoyo';
import { defineRouter, lazy } from 'alemonjs';

export default defineRouter([
  {
    // 验证码中间件
    handler: lazy(() => import('@src/response/mw')),
    children: [
      {
        regular: mihoyoRouteRules.help,
        handler: lazy(() => import('@src/response/mihoyo/help'))
      },
      {
        regular: mihoyoRouteRules.status,
        handler: lazy(() => import('@src/response/mihoyo/status'))
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
      }
    ]
  }
]);
