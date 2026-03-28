export declare const mihoyoConstants: {
    readonly commandPrefixPattern: "(!|！|/|#|＃)";
    readonly games: {
        readonly gs: {
            readonly key: "gs";
            readonly name: "原神";
        };
        readonly sr: {
            readonly key: "sr";
            readonly name: "星穹铁道";
        };
        readonly zzz: {
            readonly key: "zzz";
            readonly name: "绝区零";
        };
    };
    readonly ckMaskKeepLength: 6;
    readonly requestTimeoutMs: 10000;
    readonly cacheSeconds: 300;
};
export declare const mihoyoRouteRules: {
    readonly help: RegExp;
    readonly bindCk: RegExp;
    readonly bindUid: RegExp;
    readonly showUid: RegExp;
    readonly myCk: RegExp;
    readonly delUid: RegExp;
    readonly cookieAccept: RegExp;
    readonly dailyNote: RegExp;
    readonly playerIndex: RegExp;
    readonly spiralAbyss: RegExp;
    readonly roleExplore: RegExp;
    readonly weapon: RegExp;
    readonly buddy: RegExp;
    readonly roleCombat: RegExp;
    readonly ledger: RegExp;
    readonly exchange: RegExp;
    readonly useCode: RegExp;
    readonly mysNews: RegExp;
    readonly ckHelp: RegExp;
    readonly ckCheck: RegExp;
    readonly bindStoken: RegExp;
    readonly stokenAccept: RegExp;
    readonly myStoken: RegExp;
    readonly delStoken: RegExp;
    readonly gameSign: RegExp;
    readonly bbsSign: RegExp;
    readonly qrLogin: RegExp;
    readonly sevenSaints: RegExp;
    readonly birthday: RegExp;
    readonly payLog: RegExp;
    readonly payLogAuth: RegExp;
};
