const mihoyoKeyPrefix = 'data:alemonjs-mhy';
const mihoyoKeys = {
    base: (data) => `${mihoyoKeyPrefix}${data ?? ''}`,
    cookieByUser: (userId) => `${mihoyoKeyPrefix}:cookie:user:${userId}`,
    stokenByUser: (userId) => `${mihoyoKeyPrefix}:stoken:user:${userId}`,
    uidByUserAndGame: (userId, game) => `${mihoyoKeyPrefix}:uid:user:${userId}:${game}`,
    authKeyByUid: (uid) => `${mihoyoKeyPrefix}:authkey:uid:${uid}`,
    queryCache: (game, uid, api) => `${mihoyoKeyPrefix}:cache:${game}:${uid}:${api}`,
    deviceFp: (uid) => `${mihoyoKeyPrefix}:device_fp:${uid}`,
    qrLoginLock: (userId) => `${mihoyoKeyPrefix}:qrlogin:lock:${userId}`,
    publicCookiePool: () => `${mihoyoKeyPrefix}:public:cookie_pool`,
    migrationPhase: () => `${mihoyoKeyPrefix}:migration:phase`
};

export { mihoyoKeys };
