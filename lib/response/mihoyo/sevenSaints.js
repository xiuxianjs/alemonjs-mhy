import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';

var sevenSaints = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const text = e.MessageText ?? '';
    const md = Format.createMarkdown();
    const game = 'gs';
    const isCardQuery = /(角色|行动).*(牌|卡)/.test(text);
    if (isCardQuery) {
        const needAvatar = text.includes('角色');
        const result = await queryMihoyoApi({
            userId,
            game,
            api: 'gcgCardList',
            query: {
                need_avatar: needAvatar ? 'true' : 'false',
                need_action: needAvatar ? 'false' : 'true',
                need_map: 'false'
            }
        });
        if (!result.success) {
            md.addText(`[七圣召唤] ${result.message}`);
        }
        else {
            const cards = (result.data?.card_list ?? result.data?.avatar_card_list ?? result.data?.action_card_list ?? []);
            const cardType = needAvatar ? '角色' : '行动';
            const lines = [`【七圣召唤·${cardType}卡牌】 UID:${result.uid}`, ''];
            if (cards.length === 0) {
                lines.push('暂无卡牌数据');
            }
            else {
                const display = cards.slice(0, 30);
                for (const card of display) {
                    lines.push(`${card.name ?? '未知'} ×${card.num ?? 0}`);
                }
                if (cards.length > 30) {
                    lines.push(`...共${cards.length}张`);
                }
            }
            md.addText(lines.join('\n'));
        }
    }
    else {
        const result = await queryMihoyoApi({
            userId,
            game,
            api: 'deckList'
        });
        if (!result.success) {
            md.addText(`[七圣召唤] ${result.message}`);
        }
        else {
            const deckList = (result.data?.deck_list ?? []);
            const nickname = result.data?.nickname ?? '';
            const level = result.data?.level ?? 0;
            const idMatch = text.match(/([0-9]{1,2})/);
            if (idMatch && !text.includes('列表')) {
                const deckId = idMatch[1];
                const deck = deckList.find(d => String(d.id) === deckId);
                if (!deck) {
                    md.addText(`无牌组${deckId}，请查看 #七圣查询牌组列表`);
                }
                else {
                    const avatars = (deck.avatar_cards ?? []).map(c => c.name ?? '?');
                    const actions = (deck.action_cards ?? []).map(c => `${c.name ?? '?'} ×${c.num ?? 1}`);
                    const lines = [
                        `【七圣召唤·牌组详情】 ${nickname} Lv.${level}`,
                        '',
                        `牌组${deck.id}: ${deck.name ?? ''}`,
                        '',
                        '角色卡:',
                        ...avatars.map(n => `  ${n}`),
                        '',
                        '行动卡:',
                        ...actions.map(n => `  ${n}`)
                    ];
                    md.addText(lines.join('\n'));
                }
            }
            else {
                const lines = [`【七圣召唤·牌组列表】 ${nickname} Lv.${level}`, ''];
                if (deckList.length === 0) {
                    lines.push('暂无牌组');
                }
                else {
                    for (const deck of deckList) {
                        const avatarNames = (deck.avatar_cards ?? []).map(c => c.name ?? '?').join('、');
                        lines.push(`${deck.id}. ${deck.name ?? '牌组'} [${avatarNames}]`);
                    }
                }
                lines.push('', '查看详情: #七圣查询牌组1');
                md.addText(lines.join('\n'));
            }
        }
    }
    const format = Format.create();
    format.addMarkdown(md);
    void message.send({ format });
};

export { sevenSaints as default };
