import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const ABYSS_NAMES = {
    gs: '深境螺旋',
    sr: '忘却之庭',
    zzz: '式舆防卫战'
};
const resolveGame = (text) => {
    if (text.includes('星铁') || text.includes('忘却之庭') || text.includes('虚构叙事')) {
        return 'sr';
    }
    return 'gs';
};
const formatGsAbyss = (data, uid) => {
    const lines = [
        `【原神 · 深境螺旋】${uid}`,
        '',
        `最深抵达: ${data.max_floor}  |  总星数: ${data.total_star}★`,
        `战斗次数: ${data.total_battle_times}  |  胜利: ${data.total_win_times}`
    ];
    if (data.damage_rank.length > 0) {
        lines.push(`最强一击: ${data.damage_rank[0].value}`);
    }
    if (data.take_damage_rank.length > 0) {
        lines.push(`最多承伤: ${data.take_damage_rank[0].value}`);
    }
    if (data.defeat_rank.length > 0) {
        lines.push(`最多击破: ${data.defeat_rank[0].value}`);
    }
    const highFloors = data.floors.filter(f => f.index >= 9);
    if (highFloors.length > 0) {
        lines.push('', '--- 楼层 ---');
        highFloors.forEach(floor => {
            lines.push(`第${floor.index}层: ${floor.star}/${floor.max_star}★`);
        });
    }
    return lines.join('\n');
};
const formatSrAbyss = (data, uid) => {
    if (!data.has_data) {
        return `【星穹铁道 · 忘却之庭】${uid}\n\n本期暂无挑战数据`;
    }
    const lines = [
        `【星穹铁道 · 忘却之庭】${uid}`,
        '',
        `最深抵达: ${data.max_floor}  |  总星数: ${data.total_stars}★`,
        `战斗次数: ${data.total_battles}`
    ];
    if (data.all_floor_detail.length > 0) {
        lines.push('', '--- 楼层 ---');
        data.all_floor_detail.forEach(floor => {
            lines.push(`${floor.name}: ${floor.star_num}★ (${floor.round_num}轮)`);
        });
    }
    return lines.join('\n');
};
var spiralAbyss = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const text = e.MessageText ?? '';
    const game = resolveGame(text);
    if (game === 'zzz') {
        const md = Format.createMarkdown();
        md.addText('绝区零暂不支持深渊查询');
        const format = Format.create();
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const isLast = /上期|往期/.test(text);
    const scheduleType = isLast ? 2 : 1;
    const result = await queryMihoyoApi({
        userId,
        game,
        api: 'spiralAbyss',
        query: { schedule_type: scheduleType }
    });
    const md = Format.createMarkdown();
    if (!result.success) {
        md.addText(`[${ABYSS_NAMES[game]}] ${result.message}`);
    }
    else {
        const uid = result.uid ?? '';
        if (game === 'gs') {
            md.addText(formatGsAbyss(result.data, uid));
        }
        else {
            md.addText(formatSrAbyss(result.data, uid));
        }
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { spiralAbyss as default };
