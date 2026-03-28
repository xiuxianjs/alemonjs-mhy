import React from 'react';
export interface GsDailyNoteData {
    game: 'gs';
    uid: string;
    current_resin: number;
    max_resin: number;
    resin_recovery_time: string;
    finished_task_num: number;
    total_task_num: number;
    current_expedition_num: number;
    max_expedition_num: number;
    expeditions: Array<{
        status: string;
        remained_time: string;
    }>;
    current_home_coin: number;
    max_home_coin: number;
    home_coin_recovery_time: string;
    transformer?: {
        obtained: boolean;
        recovery_time: {
            reached: boolean;
            Day: number;
            Hour: number;
            Minute: number;
        };
    };
}
export interface SrDailyNoteData {
    game: 'sr';
    uid: string;
    current_stamina: number;
    max_stamina: number;
    stamina_recover_time: number;
    current_reserve_stamina: number;
    current_train_score: number;
    max_train_score: number;
    accepted_expedition_num: number;
    total_expedition_num: number;
    expeditions: Array<{
        status: string;
        remaining_time: number;
        name: string;
    }>;
}
export interface ZzzDailyNoteData {
    game: 'zzz';
    uid: string;
    energy: {
        progress: {
            max: number;
            current: number;
        };
        restore: number;
    };
    vitality: {
        max: number;
        current: number;
    };
    card_sign: string;
}
export type DailyNoteData = GsDailyNoteData | SrDailyNoteData | ZzzDailyNoteData;
export interface DailyNoteCardProps {
    data: DailyNoteData;
}
export default function DailyNoteCard({ data }: DailyNoteCardProps): React.JSX.Element;
