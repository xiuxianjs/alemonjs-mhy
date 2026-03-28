import React from 'react';
export interface CombatRound {
    avatars: Array<{
        avatar_id: number;
        avatar_type: number;
        name: string;
        element: string;
        level: number;
        rarity: number;
    }>;
    choice_cards: Array<{
        name: string;
        desc: string;
    }>;
    buffs: Array<{
        name: string;
        desc: string;
    }>;
    round_id: number;
    is_get_medal: boolean;
}
export interface CombatDetail {
    rounds_data: CombatRound[];
    detail_stat: {
        difficulty_id: number;
        max_round_id: number;
        avatar_bonus_num: number;
        rent_cnt: number;
    };
    backup_avatars: Array<{
        avatar_id: number;
        name: string;
        level: number;
        rarity: number;
    }>;
}
export interface CombatSchedule {
    start_time: number;
    end_time: number;
    schedule_type: number;
    schedule_id: number;
    start_date_time: {
        year: string;
        month: string;
        day: string;
    };
    end_date_time: {
        year: string;
        month: string;
        day: string;
    };
}
export interface CombatStat {
    difficulty_id: number;
    max_round_id: number;
    heresy_count: number;
    avatar_bonus_num: number;
    rent_cnt: number;
    coin_num: number;
}
export interface RoleCombatData {
    uid: string;
    has_data: boolean;
    has_detail_data: boolean;
    data: Array<{
        detail: CombatDetail;
        stat: CombatStat;
        schedule: CombatSchedule;
    }>;
}
export interface RoleCombatCardProps {
    data: RoleCombatData;
}
export default function RoleCombatCard({ data }: RoleCombatCardProps): React.JSX.Element;
