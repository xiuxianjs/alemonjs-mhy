import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const formatBuddyList = (data, uid) => {
    const buddies = data.list ?? [];
    if (buddies.length === 0) {
        return `【绝区零·邦布】${uid}\n\n暂无邦布数据`;
    }
    const lines = [`【绝区零·邦布】${uid}`, '', `共 ${buddies.length} 只邦布`, ''];
    const sorted = [...buddies].sort((a, b) => b.level - a.level || b.star - a.star);
    sorted.forEach(b => {
        lines.push(`${b.rarity} ${b.name} Lv.${b.level} ★${b.star}`);
    });
    return lines.join('\n');
};
var buddy = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const result = await queryMihoyoApi({
        userId,
        game: 'zzz',
        api: 'buddy'
    });
    const md = Format.createMarkdown();
    if (!result.success) {
        md.addText(`[邦布] ${result.message}`);
    }
    else {
        md.addText(formatBuddyList(result.data, result.uid ?? ''));
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { buddy as default };
