import { mihoyoMigrationPhases } from '@src/constants/mihoyo';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const migrationTips = [
  '迁移目标：把 Miao-Yunzai 的米游社服务迁移到 alemonjs 的路由 + 应用层 + 模型层 + 数据层。',
  '当前已完成：Phase-1 骨架 + Phase-2 账号与Cookie绑定。',
  '下一步建议：迁移 dailyNote / index / character 等基础查询。'
];

export default (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);

  const format = Format.create();
  const md = Format.createMarkdown();

  md.addText('米游社迁移模块（alemonjs）');
  md.addNewline();
  md.addText('');
  md.addNewline();

  migrationTips.forEach(item => {
    md.addText(`- ${item}`);
    md.addNewline();
  });

  md.addText('');
  md.addNewline();
  md.addText('阶段清单：');
  md.addNewline();

  mihoyoMigrationPhases.forEach(item => {
    md.addText(`- ${item}`);
    md.addNewline();
  });

  format.addMarkdown(md);

  void message.send({ format });
};
