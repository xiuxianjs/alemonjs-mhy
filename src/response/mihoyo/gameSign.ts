/**
 * 游戏签到 响应处理
 * 命令: #原神签到 / #星铁签到 / #游戏签到 / #签到
 */
import { performGameSign, resolveSignGameKey } from '@src/model/mihoyo/sign';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const rawText = e.MessageText ?? '';

  // 从消息文本中解析要签到的游戏
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
