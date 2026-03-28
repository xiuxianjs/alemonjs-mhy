/**
 * 全局中间件
 * 所有后续插件可通过 e.mihoyo 直接访问游戏类型
 * 注意: e.mihoyo 只挂可序列化的纯数据（无函数），
 * 因为 alemonjs 跨进程传递事件时使用 v8.serialize。
 */
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { EventsEnum, Next } from 'alemonjs';

// ─── 游戏类型检测 ────────────────────────────────────

const SR_REG = /星铁|星穹铁道|崩铁|崩坏星穹铁道/;
const ZZZ_REG = /绝区零|zzz/i;

export const resolveGame = (text: string): MihoyoGame => {
  if (SR_REG.test(text)) {
    return 'sr';
  }

  if (ZZZ_REG.test(text)) {
    return 'zzz';
  }

  return 'gs';
};

// ─── Mihoyo 挂载数据（纯可序列化对象） ──────────────

export interface MihoyoContext {
  /** 当前消息推断的游戏类型 */
  game: MihoyoGame;
  /** 是否原神 */
  isGs: boolean;
  /** 是否星穹铁道 */
  isSr: boolean;
  /** 是否绝区零 */
  isZzz: boolean;
}

// ─── 中间件实现 ──────────────────────────────────────

export default (event: EventsEnum, next: Next) => {
  const text = event.MessageText ?? '';
  const game = resolveGame(text);

  const mihoyo: MihoyoContext = {
    game,
    isGs: game === 'gs',
    isSr: game === 'sr',
    isZzz: game === 'zzz'
  };

  // 挂载到事件对象（只读，纯数据可序列化）
  Object.defineProperty(event, 'mihoyo', {
    value: mihoyo,
    writable: false,
    configurable: false,
    enumerable: true
  });

  next();
};
