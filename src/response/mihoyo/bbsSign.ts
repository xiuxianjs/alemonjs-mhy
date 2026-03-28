/**
 * 米游社社区签到 (米游币) 响应处理
 * 命令: #米游社签到 / #米游币签到 / #米币签到
 */
import { performBbsSign } from '@src/model/mihoyo/sign';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

export default async (e: EventsEnum) => {
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
