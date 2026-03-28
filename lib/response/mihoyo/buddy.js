import BuddyCard from '../../img/views/BuddyCard.js';
import { queryMihoyoApi } from '../../model/mihoyo/query.js';
import { createEvent, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

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
    const format = Format.create();
    if (!result.success) {
        const md = Format.createMarkdown();
        md.addText(`[邦布] ${result.message}`);
        format.addMarkdown(md);
    }
    else {
        const data = result.data;
        const img = await renderComponentIsHtmlToBuffer(BuddyCard, {
            data: { uid: result.uid ?? '', list: data.list }
        });
        format.addImage(img);
    }
    void message.send({ format });
};

export { buddy as default };
