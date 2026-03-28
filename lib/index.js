import router from './router.js';
import routerMw from './router-mw.js';
export { resolveGame } from './middleware/mw.js';
export { resolveMihoyoRegion } from './model/mihoyo/region.js';
export { addUserUid, bindUserCookie, deleteUserCookie, getUserCookie, getUserMainUid, getUserUids, removeUserUid } from './model/mihoyo/account.js';
export { bindStoken, buildStokenCookie, deleteUserStoken, getUserStoken, saveUserStoken } from './model/mihoyo/stoken.js';
export { performBbsSign, performGameSign, resolveSignGameKey } from './model/mihoyo/sign.js';
export { queryMihoyoApi } from './model/mihoyo/query.js';
export { fetchGameRoles, fetchUserFullInfo, mysApiFetch } from './model/mihoyo/mysApi.js';

var index = defineChildren({
    register() {
        return {
            responseRouter: router,
            middlewareRouter: routerMw
        };
    },
    onCreated() {
        logger.info('mihoyo服务');
    }
});

export { index as default };
