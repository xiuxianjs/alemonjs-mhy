import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';

const formatCombat = (data, uid) => {
    if (!data.has_data || data.data.length === 0) {
        return `【幻想真境剧诗】${uid}\n\n本期暂无挑战数据`;
    }
    if (!data.has_detail_data) {
        return `【幻想真境剧诗】${uid}\n\n数据还没更新，请稍后再试`;
    }
    const current = data.data[0];
    const schedule = current.schedule;
    const stat = current.stat;
    const detail = current.detail;
    const lines = [
        `【幻想真境剧诗】${uid}`,
        '',
        `周期: ${schedule.start_date_time.month}/${schedule.start_date_time.day} ~ ${schedule.end_date_time.month}/${schedule.end_date_time.day}`,
        `最深幕数: 第${stat.max_round_id}幕  |  异端值: ${stat.heresy_count}`,
        `获取金币: ${stat.coin_num}  |  助战: ${stat.rent_cnt}次`
    ];
    if (detail.rounds_data && detail.rounds_data.length > 0) {
        lines.push('', '--- 各幕阵容 ---');
        detail.rounds_data.forEach(round => {
            const names = round.avatars.map(a => a.name).join(' / ');
            const medal = round.is_get_medal ? ' ✦' : '';
            lines.push(`第${round.round_id}幕${medal}: ${names}`);
        });
    }
    if (detail.backup_avatars && detail.backup_avatars.length > 0) {
        lines.push('', '--- 候选角色 ---');
        const backupNames = detail.backup_avatars.map(a => `${a.name}Lv.${a.level}`).join(' / ');
        lines.push(backupNames);
    }
    return lines.join('\n');
};
var roleCombat = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const result = await queryMihoyoApi({
        userId,
        game: 'gs',
        api: 'roleCombat',
        query: { need_detail: true }
    });
    const md = Format.createMarkdown();
    if (!result.success) {
        md.addText(`[剧诗] ${result.message}`);
    }
    else {
        md.addText(formatCombat(result.data, result.uid ?? ''));
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { roleCombat as default };
