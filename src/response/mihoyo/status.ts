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
  md.addText('- phase-3: 已完成（体力/角色面板/深渊查询）');
  md.addNewline();
  md.addText('- phase-4: 已完成（探索/武器/邦布/剧诗/札记/兑换码/公告/CK工具）');
  md.addNewline();
  md.addText('- phase-5: 待开发（抽卡记录/充值记录/authkey链路）');

  format.addMarkdown(md);

  void message.send({ format });
};
