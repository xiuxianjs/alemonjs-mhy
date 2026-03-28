import { getUserUids, removeUserUid } from '../../model/mihoyo/account.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const GAME_NAMES = {
    gs: '原神',
    sr: '星穹铁道',
    zzz: '绝区零'
};
const resolveGame = (text) => {
    if (text.includes('星铁')) {
        return 'sr';
    }
    if (text.includes('绝区零')) {
        return 'zzz';
    }
    return 'gs';
};
var delUid = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const text = e.MessageText ?? '';
    const game = resolveGame(text);
    const indexMatch = text.match(/(\d+)$/);
    const md = Format.createMarkdown();
    if (indexMatch) {
        const index = parseInt(indexMatch[1]) - 1;
        const uids = await getUserUids(userId, game);
        if (index < 0 || index >= uids.length) {
            md.addText(`UID序号不存在，当前共 ${uids.length} 个UID`);
            const errFormat = Format.create();
            errFormat.addMarkdown(md);
            void message.send({ format: errFormat });
            return;
        }
        const targetUid = uids[index];
        const removed = await removeUserUid(userId, game, targetUid);
        md.addText(removed ? `已删除 ${GAME_NAMES[game]} UID: ${targetUid}` : '删除失败');
    }
    else {
        const uids = await getUserUids(userId, game);
        if (uids.length === 0) {
            md.addText(`暂无绑定的${GAME_NAMES[game]}UID`);
            const emptyFormat = Format.create();
            emptyFormat.addMarkdown(md);
            void message.send({ format: emptyFormat });
            return;
        }
        const lastUid = uids[uids.length - 1];
        const removed = await removeUserUid(userId, game, lastUid);
        md.addText(removed ? `已删除 ${GAME_NAMES[game]} UID: ${lastUid}` : '删除失败');
    }
    const remaining = await getUserUids(userId, game);
    if (remaining.length > 0) {
        md.addNewline();
        md.addText(`剩余: ${remaining.join(', ')}`);
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { delUid as default };
