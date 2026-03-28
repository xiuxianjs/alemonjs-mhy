import { performBbsSign } from '../../model/mihoyo/sign.js';
import { createEvent, useMessage, Format } from 'alemonjs';

var bbsSign = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['message.create', 'private.message.create']
    });
    const [message] = useMessage(event);
    const userId = event.UserId;
    const md = Format.createMarkdown();
    md.addText('正在进行米游社签到，请稍等...');
    const tipFormat = Format.create();
    tipFormat.addMarkdown(md);
    void message.send({ format: tipFormat });
    const result = await performBbsSign(userId);
    const resMd = Format.createMarkdown();
    resMd.addText(result.message);
    const resFormat = Format.create();
    resFormat.addMarkdown(resMd);
    void message.send({ format: resFormat });
};

export { bbsSign as default };
