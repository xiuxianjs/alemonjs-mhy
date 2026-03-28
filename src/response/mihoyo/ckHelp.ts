/**
 * CK帮助 / Cookie教程
 * 命令: #ck帮助 / #cookie帮助
 */
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const CK_HELP_TEXT = [
  '【Cookie 绑定教程】',
  '',
  '一、获取Cookie',
  '1. 使用浏览器打开 https://www.miyoushe.com',
  '2. 登录你的米游社账号',
  '3. 按 F12 打开开发者工具',
  '4. 切换到 Console(控制台) 标签',
  '5. 输入以下代码并回车:',
  '',
  'document.cookie',
  '',
  '6. 复制输出的全部内容',
  '',
  '二、绑定Cookie',
  '发送: #绑定ck <你的Cookie>',
  '或直接发送Cookie内容（包含ltoken字段）',
  '',
  '⚠️ 注意事项:',
  '- 请在私聊中发送Cookie，避免泄露',
  '- Cookie有效期约30天',
  '- 切勿将Cookie分享给他人',
  '- 如账号已退出登录, Cookie将失效',
  '',
  '三、其他命令',
  '#我的ck — 查看已绑定的Cookie状态',
  '#删除ck — 删除已绑定的Cookie',
  '#绑定uid <UID> — 手动绑定游戏UID',
  '#我的uid — 查看已绑定的UID列表'
].join('\n');

// ─── 入口 ────────────────────────────────────────────

export default (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const md = Format.createMarkdown();

  md.addText(CK_HELP_TEXT);

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
