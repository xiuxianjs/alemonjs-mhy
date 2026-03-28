import { queryMihoyoApi } from '../../model/mihoyo/query.js';
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
const formatGsIndex = (data, uid) => {
    const s = data.stats;
    const lines = [
        `【原神】${uid}`,
        '',
        `活跃天数: ${s.active_day_number}  |  成就: ${s.achievement_number}`,
        `角色数量: ${s.avatar_number}  |  深渊: ${s.spiral_abyss}`,
        `风神瞳: ${s.anemoculus_number}  |  岩神瞳: ${s.geoculus_number}`,
        `雷神瞳: ${s.electroculus_number}  |  草神瞳: ${s.dendroculus_number}`,
        `华丽宝箱: ${s.luxurious_chest_number}  |  珍贵宝箱: ${s.precious_chest_number}`,
        `精致宝箱: ${s.exquisite_chest_number}  |  普通宝箱: ${s.common_chest_number}`
    ];
    if (data.world_explorations.length > 0) {
        lines.push('', '--- 世界探索 ---');
        data.world_explorations
            .sort((a, b) => b.exploration_percentage - a.exploration_percentage)
            .forEach(w => {
            const pct = (w.exploration_percentage / 10).toFixed(1);
            lines.push(`${w.name}: ${pct}%`);
        });
    }
    if (data.avatars.length > 0) {
        lines.push('', '--- 角色 ---');
        const sorted = [...data.avatars].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
        const top = sorted.slice(0, 10);
        top.forEach(a => {
            lines.push(`${a.name} Lv.${a.level} ★${a.rarity} 命座${a.actived_constellation_num} 好感${a.fetter}`);
        });
        if (sorted.length > 10) {
            lines.push(`... 共${sorted.length}个角色`);
        }
    }
    return lines.join('\n');
};
const formatSrIndex = (data, uid) => {
    const s = data.stats;
    const lines = [
        `【星穹铁道】${uid}`,
        '',
        `活跃天数: ${s.active_days}  |  成就: ${s.achievement_num}`,
        `角色数量: ${s.avatar_num}  |  宝箱: ${s.chest_num}`,
        `忘却之庭: ${s.abyss_process}`
    ];
    if (data.avatar_list.length > 0) {
        lines.push('', '--- 角色 ---');
        const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
        const top = sorted.slice(0, 10);
        top.forEach(a => {
            lines.push(`${a.name} Lv.${a.level} ★${a.rarity} 星魂${a.rank}`);
        });
        if (sorted.length > 10) {
            lines.push(`... 共${sorted.length}个角色`);
        }
    }
    return lines.join('\n');
};
const formatZzzIndex = (data, uid) => {
    const s = data.stats;
    const lines = [
        `【绝区零】${uid}`,
        '',
        `活跃天数: ${s.active_days}  |  成就: ${s.achievement_count}`,
        `代理人: ${s.avatar_num}  |  邦布: ${s.buddy_num}`,
        `式舆防卫战: 第${s.cur_period_zone_layer_count}层`
    ];
    if (data.avatar_list.length > 0) {
        lines.push('', '--- 代理人 ---');
        const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level);
        const top = sorted.slice(0, 10);
        top.forEach(a => {
            lines.push(`${a.full_name} Lv.${a.level} ${a.rarity} 影画${a.rank}`);
        });
        if (sorted.length > 10) {
            lines.push(`... 共${sorted.length}个代理人`);
        }
    }
    return lines.join('\n');
};
var playerIndex = async (e) => {
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
        md.addText(`[${GAME_NAMES[game]}角色] ${result.message}`);
    }
    else {
        const uid = result.uid ?? '';
        switch (game) {
            case 'gs':
                md.addText(formatGsIndex(result.data, uid));
                break;
            case 'sr':
                md.addText(formatSrIndex(result.data, uid));
                break;
            case 'zzz':
                md.addText(formatZzzIndex(result.data, uid));
                break;
        }
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { playerIndex as default };
