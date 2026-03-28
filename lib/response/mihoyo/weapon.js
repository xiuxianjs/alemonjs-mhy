import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const formatWeaponList = (data, uid, text) => {
    const avatars = data.avatars ?? [];
    if (avatars.length === 0) {
        return `【武器】${uid}\n\n暂无角色数据`;
    }
    let filterRarity = 0;
    if (/五星|5星/.test(text)) {
        filterRarity = 5;
    }
    else if (/四星|4星/.test(text)) {
        filterRarity = 4;
    }
    let list = avatars.filter(a => a.weapon.rarity > 1);
    if (filterRarity > 0) {
        list = list.filter(a => a.weapon.rarity === filterRarity);
    }
    list.sort((a, b) => {
        const diff = b.weapon.rarity - a.weapon.rarity;
        if (diff !== 0) {
            return diff;
        }
        const lvDiff = b.weapon.level - a.weapon.level;
        if (lvDiff !== 0) {
            return lvDiff;
        }
        return b.weapon.affix_level - a.weapon.affix_level;
    });
    const lines = [`【武器】${uid}`, ''];
    const count5 = list.filter(a => a.weapon.rarity === 5).length;
    const count4 = list.filter(a => a.weapon.rarity === 4).length;
    const count3 = list.filter(a => a.weapon.rarity <= 3).length;
    lines.push(`五星: ${count5}  |  四星: ${count4}  |  三星: ${count3}`);
    lines.push('');
    list.forEach(a => {
        const w = a.weapon;
        lines.push(`★${w.rarity} ${w.name} Lv.${w.level} 精${w.affix_level} → ${a.name} Lv.${a.level}`);
    });
    return lines.join('\n');
};
var weapon = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const text = e.MessageText ?? '';
    const result = await queryMihoyoApi({
        userId,
        game: 'gs',
        api: 'character',
        body: {}
    });
    const md = Format.createMarkdown();
    if (!result.success) {
        md.addText(`[武器] ${result.message}`);
    }
    else {
        md.addText(formatWeaponList(result.data, result.uid ?? '', text));
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { weapon as default };
