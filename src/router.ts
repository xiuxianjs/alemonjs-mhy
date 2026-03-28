import { mihoyoRouteRules } from '@src/constants/mihoyo';
import { defineRouter, lazy } from 'alemonjs';

export default defineRouter([
  {
    // 验证码中间件
    handler: lazy(() => import('@src/response/mw')),
    children: [
      {
        regular: /^(!|！|\/|#|＃)mhy(帮助|help|menu|菜单)\s*\d*$/,
        handler: lazy(() => import('@src/response/help'))
      },
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
      }
    ]
  }
]);
