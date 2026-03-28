const SR_REG = /星铁|星穹铁道|崩铁|崩坏星穹铁道/;
const ZZZ_REG = /绝区零|zzz/i;
const resolveGame = (text) => {
    if (SR_REG.test(text)) {
        return 'sr';
    }
    if (ZZZ_REG.test(text)) {
        return 'zzz';
    }
    return 'gs';
};
var mw = (event, next) => {
    const text = event.MessageText ?? '';
    const game = resolveGame(text);
    const mihoyo = {
        game,
        isGs: game === 'gs',
        isSr: game === 'sr',
        isZzz: game === 'zzz'
    };
    Object.defineProperty(event, 'mihoyo', {
        value: mihoyo,
        writable: false,
        configurable: false,
        enumerable: true
    });
    next();
};

export { mw as default, resolveGame };
