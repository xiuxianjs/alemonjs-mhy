import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

export default (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);

  const format = Format.create();
  const md = Format.createMarkdown();

  md.addText('米游社模块状态：');
  md.addNewline();
  md.addText('- phase-1: 已完成（骨架可用）');
  md.addNewline();
  md.addText('- phase-2: 已完成（Cookie/UID绑定、账号管理）');
  md.addNewline();
  md.addText('- phase-3: 待开发（基础查询接口）');
  md.addNewline();
  md.addText('- phase-4: 待开发（抽卡/充值链路）');
  md.addNewline();
  md.addText('- phase-5: 待开发（公告推送任务）');

  format.addMarkdown(md);

  void message.send({ format });
};
