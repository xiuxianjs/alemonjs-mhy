import Help, { TOTAL_PAGES } from '@src/img/views/Help';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentToBuffer } from 'jsxp';

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);

  // 提取数字
  const pageMatch = e.MessageText.match(/(\d+)/);
  let page = pageMatch ? parseInt(pageMatch[1]) : 1;

  if (page < 1) {
    page = 1;
  }
  if (page > TOTAL_PAGES) {
    page = TOTAL_PAGES;
  }

  const img = await renderComponentToBuffer('/help', Help, { data: { page, totalPages: TOTAL_PAGES } });

  if (typeof img === 'boolean') {
    const format = Format.create();
    const errMd = Format.createMarkdown();

    errMd.addText('帮助图片加载失败，请发送 /我 查看主页');

    format.addMarkdown(errMd);
    void message.send({ format });

    return;
  }

  const format = Format.create();

  format.addImage(img);

  void message.send({ format });
};
