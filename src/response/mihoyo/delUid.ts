/**
 * 删除UID
 * 命令: #删除uid / #解绑uid / #原神删除uid / #星铁删除uid / #绝区零删除uid
 */
import { getUserUids, removeUserUid } from '@src/model/mihoyo/account';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const resolveGame = (text: string): MihoyoGame => {
  if (text.includes('星铁')) {
    return 'sr';
  }

  if (text.includes('绝区零')) {
    return 'zzz';
  }

  return 'gs';
};

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';
  const game = resolveGame(text);

  // 尝试提取序号
  const indexMatch = text.match(/(\d+)$/);
  const md = Format.createMarkdown();

  if (indexMatch) {
    const index = parseInt(indexMatch[1]) - 1;
    const uids = await getUserUids(userId, game);

    if (index < 0 || index >= uids.length) {
      md.addText(`UID序号不存在，当前共 ${uids.length} 个UID`);
      const errFormat = Format.create();

      errFormat.addMarkdown(md);
      void message.send({ format: errFormat });

      return;
    }

    const targetUid = uids[index];
    const removed = await removeUserUid(userId, game, targetUid);

    md.addText(removed ? `已删除 ${GAME_NAMES[game]} UID: ${targetUid}` : '删除失败');
  } else {
    // 没有序号，删除最后一个
    const uids = await getUserUids(userId, game);

    if (uids.length === 0) {
      md.addText(`暂无绑定的${GAME_NAMES[game]}UID`);
      const emptyFormat = Format.create();

      emptyFormat.addMarkdown(md);
      void message.send({ format: emptyFormat });

      return;
    }

    const lastUid = uids[uids.length - 1];
    const removed = await removeUserUid(userId, game, lastUid);

    md.addText(removed ? `已删除 ${GAME_NAMES[game]} UID: ${lastUid}` : '删除失败');
  }

  // 显示剩余列表
  const remaining = await getUserUids(userId, game);

  if (remaining.length > 0) {
    md.addNewline();
    md.addText(`剩余: ${remaining.join(', ')}`);
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
