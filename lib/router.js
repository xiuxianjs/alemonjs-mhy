import { mihoyoRouteRules } from './constants/mihoyo.js';
import { defineRouter, lazy } from 'alemonjs';

var router = defineRouter([
    {
        handler: lazy(() => import('./response/mw.js')),
        children: [
            {
                regular: mihoyoRouteRules.help,
                handler: lazy(() => import('./response/mihoyo/help.js'))
            },
            {
                regular: mihoyoRouteRules.bindCk,
                handler: lazy(() => import('./response/mihoyo/bindCk.js'))
            },
            {
                regular: mihoyoRouteRules.cookieAccept,
                handler: lazy(() => import('./response/mihoyo/bindCk.js'))
            },
            {
                regular: mihoyoRouteRules.bindUid,
                handler: lazy(() => import('./response/mihoyo/bindUid.js'))
            },
            {
                regular: mihoyoRouteRules.showUid,
                handler: lazy(() => import('./response/mihoyo/showUid.js'))
            },
            {
                regular: mihoyoRouteRules.myCk,
                handler: lazy(() => import('./response/mihoyo/myCk.js'))
            },
            {
                regular: mihoyoRouteRules.delUid,
                handler: lazy(() => import('./response/mihoyo/delUid.js'))
            },
            {
                regular: mihoyoRouteRules.dailyNote,
                handler: lazy(() => import('./response/mihoyo/dailyNote.js'))
            },
            {
                regular: mihoyoRouteRules.playerIndex,
                handler: lazy(() => import('./response/mihoyo/playerIndex.js'))
            },
            {
                regular: mihoyoRouteRules.spiralAbyss,
                handler: lazy(() => import('./response/mihoyo/spiralAbyss.js'))
            },
            {
                regular: mihoyoRouteRules.roleExplore,
                handler: lazy(() => import('./response/mihoyo/roleExplore.js'))
            },
            {
                regular: mihoyoRouteRules.weapon,
                handler: lazy(() => import('./response/mihoyo/weapon.js'))
            },
            {
                regular: mihoyoRouteRules.buddy,
                handler: lazy(() => import('./response/mihoyo/buddy.js'))
            },
            {
                regular: mihoyoRouteRules.roleCombat,
                handler: lazy(() => import('./response/mihoyo/roleCombat.js'))
            },
            {
                regular: mihoyoRouteRules.ledger,
                handler: lazy(() => import('./response/mihoyo/ledger.js'))
            },
            {
                regular: mihoyoRouteRules.exchange,
                handler: lazy(() => import('./response/mihoyo/exchange.js'))
            },
            {
                regular: mihoyoRouteRules.mysNews,
                handler: lazy(() => import('./response/mihoyo/mysNews.js'))
            },
            {
                regular: mihoyoRouteRules.ckHelp,
                handler: lazy(() => import('./response/mihoyo/ckHelp.js'))
            },
            {
                regular: mihoyoRouteRules.ckCheck,
                handler: lazy(() => import('./response/mihoyo/ckCheck.js'))
            }
        ]
    }
]);

export { router as default };
