/**
 * 七圣召唤查询
 * 命令: #七圣查询牌组 / #七圣召唤查询牌组列表 / #七圣查询牌组1
 *       #七圣查询角色牌 / #七圣查询行动牌
 */
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';
  const md = Format.createMarkdown();

  // 仅支持原神
  const game = 'gs' as const;

  // 判断查询类型：卡牌 or 牌组
  const isCardQuery = /(角色|行动).*(牌|卡)/.test(text);

  if (isCardQuery) {
    // 查询卡牌列表
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
    } else {
      const cards = (result.data?.card_list ?? result.data?.avatar_card_list ?? result.data?.action_card_list ?? []) as Array<{
        name?: string;
        num?: number;
      }>;
      const cardType = needAvatar ? '角色' : '行动';
      const lines = [`【七圣召唤·${cardType}卡牌】 UID:${result.uid}`, ''];

      if (cards.length === 0) {
        lines.push('暂无卡牌数据');
      } else {
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
  } else {
    // 查询牌组
    const result = await queryMihoyoApi({
      userId,
      game,
      api: 'deckList'
    });

    if (!result.success) {
      md.addText(`[七圣召唤] ${result.message}`);
    } else {
      const deckList = (result.data?.deck_list ?? []) as Array<{
        id: number;
        name?: string;
        avatar_cards?: Array<{ name?: string }>;
        action_cards?: Array<{ name?: string; num?: number }>;
      }>;
      const nickname = (result.data?.nickname as string) ?? '';
      const level = (result.data?.level as number) ?? 0;

      // 检查是否指定了牌组编号
      const idMatch = text.match(/([0-9]{1,2})/);

      if (idMatch && !text.includes('列表')) {
        const deckId = idMatch[1];
        const deck = deckList.find(d => String(d.id) === deckId);

        if (!deck) {
          md.addText(`无牌组${deckId}，请查看 #七圣查询牌组列表`);
        } else {
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
      } else {
        // 牌组列表
        const lines = [`【七圣召唤·牌组列表】 ${nickname} Lv.${level}`, ''];

        if (deckList.length === 0) {
          lines.push('暂无牌组');
        } else {
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
