/**
 * 存储在 Redis 里的 Key 相关
 */
export const baseKey = 'data:alemonjs-mhy';

const mihoyoKeyPrefix = `${baseKey}:mihoyo`;

export const mihoyoKeys = {
  base: (data?: string) => `${mihoyoKeyPrefix}${data ?? ''}`,
  cookieByUser: (userId: string | number) => `${mihoyoKeyPrefix}:cookie:user:${userId}`,
  uidByUserAndGame: (userId: string | number, game: string) => `${mihoyoKeyPrefix}:uid:user:${userId}:${game}`,
  authKeyByUid: (uid: string | number) => `${mihoyoKeyPrefix}:authkey:uid:${uid}`,
  queryCache: (game: string, uid: string | number, api: string) => `${mihoyoKeyPrefix}:cache:${game}:${uid}:${api}`,
  publicCookiePool: () => `${mihoyoKeyPrefix}:public:cookie_pool`,
  migrationPhase: () => `${mihoyoKeyPrefix}:migration:phase`
};
