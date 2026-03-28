export declare const mihoyoKeys: {
    base: (data?: string) => string;
    cookieByUser: (userId: string | number) => string;
    stokenByUser: (userId: string | number) => string;
    uidByUserAndGame: (userId: string | number, game: string) => string;
    authKeyByUid: (uid: string | number) => string;
    payLogByUser: (userId: string | number) => string;
    queryCache: (game: string, uid: string | number, api: string) => string;
    deviceFp: (uid: string | number) => string;
    qrLoginLock: (userId: string | number) => string;
    publicCookiePool: () => string;
    migrationPhase: () => string;
};
