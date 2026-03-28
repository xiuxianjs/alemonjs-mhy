import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const resolveGame = (text) => {
    if (text.includes('星铁')) {
        return 'sr';
    }
    if (text.includes('绝区零')) {
        return 'zzz';
    }
    return 'gs';
};
const formatGsExplore = (data, uid) => {
    const s = data.stats;
    const totalChest = s.luxurious_chest_number + s.precious_chest_number + s.exquisite_chest_number + s.common_chest_number + s.magic_chest_number;
    const lines = [
        `【原神·探索】${uid}`,
        '',
        `成就: ${s.achievement_number}  |  角色数: ${s.avatar_number}`,
        '',
        '--- 宝箱 ---',
        `华丽: ${s.luxurious_chest_number}  |  珍贵: ${s.precious_chest_number}`,
        `精致: ${s.exquisite_chest_number}  |  普通: ${s.common_chest_number}`,
        `奇馈: ${s.magic_chest_number}  |  总计: ${totalChest}`,
        '',
        '--- 神瞳 ---',
        `风: ${s.anemoculus_number}  岩: ${s.geoculus_number}  雷: ${s.electroculus_number}`,
        `草: ${s.dendroculus_number}  水: ${s.hydroculus_number ?? 0}  火: ${s.pyroculus_number ?? 0}`
    ];
    if (data.homes && data.homes.length > 0) {
        const home = data.homes[0];
        lines.push('', '--- 尘歌壶 ---');
        lines.push(`等级: ${home.level}  |  仙力: ${home.comfort_num}  |  摆设: ${home.item_num}`);
    }
    if (data.world_explorations.length > 0) {
        lines.push('', '--- 世界探索 ---');
        data.world_explorations
            .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
            .forEach(w => {
            const pct = (w.exploration_percentage / 10).toFixed(1);
            let extra = '';
            if (w.offerings && w.offerings.length > 0) {
                extra = ` [${w.offerings.map(o => `${o.name}Lv.${o.level}`).join(' ')}]`;
            }
            lines.push(`${w.name}: ${pct}%${extra}`);
        });
    }
    return lines.join('\n');
};
const formatSrExplore = (data, uid) => {
    const s = data.stats;
    return [
        `【星穹铁道·探索】${uid}`,
        '',
        `活跃天数: ${s.active_days}`,
        `角色数量: ${s.avatar_num}`,
        `成就: ${s.achievement_num}`,
        `宝箱: ${s.chest_num}`,
        `忘却之庭: ${s.abyss_process}`
    ].join('\n');
};
const formatZzzExplore = (data, uid) => {
    const s = data.stats;
    return [
        `【绝区零·探索】${uid}`,
        '',
        `活跃天数: ${s.active_days}`,
        `代理人: ${s.avatar_num}  |  邦布: ${s.buddy_num}`,
        `成就: ${s.achievement_count}`,
        `式舆防卫战: 第${s.cur_period_zone_layer_count}层`,
        s.world_level_name ? `等级: ${s.world_level_name}` : ''
    ]
        .filter(Boolean)
        .join('\n');
};
var roleExplore = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const text = e.MessageText ?? '';
    const game = resolveGame(text);
    const result = await queryMihoyoApi({
        userId,
        game,
        api: 'index'
    });
    const md = Format.createMarkdown();
    if (!result.success) {
        md.addText(`[探索] ${result.message}`);
    }
    else {
        const uid = result.uid ?? '';
        switch (game) {
            case 'gs':
                md.addText(formatGsExplore(result.data, uid));
                break;
            case 'sr':
                md.addText(formatSrExplore(result.data, uid));
                break;
            case 'zzz':
                md.addText(formatZzzExplore(result.data, uid));
                break;
        }
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { roleExplore as default };
