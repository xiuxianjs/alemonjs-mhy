import React from 'react';
export interface GsAbyssData {
    game: 'gs';
    uid: string;
    schedule_id: number;
    start_time: string;
    end_time: string;
    total_battle_times: number;
    total_win_times: number;
    max_floor: string;
    total_star: number;
    damage_rank: Array<{
        avatar_icon: string;
        value: number;
    }>;
    take_damage_rank: Array<{
        avatar_icon: string;
        value: number;
    }>;
    defeat_rank: Array<{
        avatar_icon: string;
        value: number;
    }>;
    normal_skill_rank: Array<{
        avatar_icon: string;
        value: number;
    }>;
    energy_skill_rank: Array<{
        avatar_icon: string;
        value: number;
    }>;
    floors: Array<{
        index: number;
        star: number;
        max_star: number;
        levels: Array<{
            index: number;
            star: number;
            max_star: number;
            battles: Array<{
                index: number;
                avatars: Array<{
                    id: number;
                    icon: string;
                    level: number;
                    rarity: number;
                }>;
            }>;
        }>;
    }>;
}
export interface SrAbyssData {
    game: 'sr';
    uid: string;
    schedule_id: number;
    begin_time: {
        year: string;
        month: string;
        day: string;
    };
    end_time: {
        year: string;
        month: string;
        day: string;
    };
    total_stars: number;
    max_floor: string;
    total_battles: number;
    has_data: boolean;
    all_floor_detail: Array<{
        name: string;
        star_num: number;
        round_num: number;
        node_1: {
            avatars: Array<{
                id: number;
                name: string;
                level: number;
                rarity: number;
            }>;
        };
        node_2: {
            avatars: Array<{
                id: number;
                name: string;
                level: number;
                rarity: number;
            }>;
        };
    }>;
}
export type SpiralAbyssData = GsAbyssData | SrAbyssData;
export interface SpiralAbyssCardProps {
    data: SpiralAbyssData;
}
export default function SpiralAbyssCard({ data }: SpiralAbyssCardProps): React.JSX.Element;
