import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const GAME_NAMES = {
    gs: '原神',
    sr: '星穹铁道',
    zzz: '绝区零'
};
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const formatCountdown = (seconds) => {
    if (seconds <= 0) {
        return '已满';
    }
    const h = Math.floor(seconds / SECONDS_PER_HOUR);
    const m = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
    if (h > 0) {
        return `${h}小时${m}分`;
    }
    return `${m}分钟`;
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
const formatGsNote = (data, uid) => {
    const lines = [
        `【原神】${uid}`,
        '',
        `树脂: ${data.current_resin}/${data.max_resin}` +
            (Number(data.resin_recovery_time) > 0 ? ` (${formatCountdown(Number(data.resin_recovery_time))})` : ' (已满)'),
        `每日委托: ${data.finished_task_num}/${data.total_task_num}`,
        `洞天宝钱: ${data.current_home_coin}/${data.max_home_coin}` +
            (Number(data.home_coin_recovery_time) > 0 ? ` (${formatCountdown(Number(data.home_coin_recovery_time))})` : '')
    ];
    if (data.expeditions.length > 0) {
        lines.push(`探索派遣: ${data.current_expedition_num}/${data.max_expedition_num}`);
        data.expeditions.forEach((exp, i) => {
            const remain = Number(exp.remained_time);
            const status = remain <= 0 ? '已完成' : formatCountdown(remain);
            lines.push(`  ${i + 1}. ${status}`);
        });
    }
    if (data.transformer?.obtained) {
        const t = data.transformer.recovery_time;
        if (t.reached) {
            lines.push('参量质变仪: 可使用');
        }
        else {
            const parts = [];
            if (t.Day > 0) {
                parts.push(`${t.Day}天`);
            }
            if (t.Hour > 0) {
                parts.push(`${t.Hour}小时`);
            }
            if (t.Minute > 0) {
                parts.push(`${t.Minute}分`);
            }
            lines.push(`参量质变仪: ${parts.join('')}`);
        }
    }
    return lines.join('\n');
};
const formatSrNote = (data, uid) => {
    const lines = [
        `【星穹铁道】${uid}`,
        '',
        `开拓力: ${data.current_stamina}/${data.max_stamina}` + (data.stamina_recover_time > 0 ? ` (${formatCountdown(data.stamina_recover_time)})` : ' (已满)'),
        `后备开拓力: ${data.current_reserve_stamina}`,
        `每日实训: ${data.current_train_score}/${data.max_train_score}`
    ];
    if (data.expeditions.length > 0) {
        lines.push(`委托: ${data.accepted_expedition_num}/${data.total_expedition_num}`);
        data.expeditions.forEach((exp, i) => {
            const status = exp.remaining_time <= 0 ? '已完成' : formatCountdown(exp.remaining_time);
            lines.push(`  ${i + 1}. ${status}`);
        });
    }
    return lines.join('\n');
};
const formatZzzNote = (data, uid) => {
    const lines = [
        `【绝区零】${uid}`,
        '',
        `电量: ${data.energy.progress.current}/${data.energy.progress.max}` + (data.energy.restore > 0 ? ` (${formatCountdown(data.energy.restore)})` : ' (已满)'),
        `活跃度: ${data.vitality.current}/${data.vitality.max}`
    ];
    return lines.join('\n');
};
var dailyNote = async (e) => {
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
        api: 'dailyNote'
    });
    const md = Format.createMarkdown();
    if (!result.success) {
        md.addText(`[${GAME_NAMES[game]}体力] ${result.message}`);
    }
    else {
        const uid = result.uid ?? '';
        switch (game) {
            case 'gs':
                md.addText(formatGsNote(result.data, uid));
                break;
            case 'sr':
                md.addText(formatSrNote(result.data, uid));
                break;
            case 'zzz':
                md.addText(formatZzzNote(result.data, uid));
                break;
        }
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { dailyNote as default };
