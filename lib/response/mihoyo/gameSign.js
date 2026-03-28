import { resolveSignGameKey, performGameSign } from '../../model/mihoyo/sign.js';
import { createEvent, useMessage, Format } from 'alemonjs';

var gameSign = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const rawText = e.MessageText ?? '';
    const gameKey = resolveSignGameKey(rawText);
    const md = Format.createMarkdown();
    md.addText('正在签到中，请稍等...');
    const tipFormat = Format.create();
    tipFormat.addMarkdown(md);
    void message.send({ format: tipFormat });
    const result = await performGameSign(userId, gameKey);
    const resMd = Format.createMarkdown();
    resMd.addText(result.message);
    const resFormat = Format.create();
    resFormat.addMarkdown(resMd);
    void message.send({ format: resFormat });
};

export { gameSign as default };
