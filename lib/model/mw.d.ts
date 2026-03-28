import type { MihoyoGame } from '@src/model/mihoyo/types';
export declare const resolveGame: (text: string) => MihoyoGame;
export interface MihoyoContext {
    game: MihoyoGame;
    isGs: boolean;
    isSr: boolean;
    isZzz: boolean;
}
