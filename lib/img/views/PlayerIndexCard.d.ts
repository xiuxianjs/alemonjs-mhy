import React from 'react';
export interface GsIndexData {
    game: 'gs';
    uid: string;
    stats: {
        active_day_number: number;
        achievement_number: number;
        anemoculus_number: number;
        geoculus_number: number;
        electroculus_number: number;
        dendroculus_number: number;
        avatar_number: number;
        spiral_abyss: string;
        luxurious_chest_number: number;
        precious_chest_number: number;
        exquisite_chest_number: number;
        common_chest_number: number;
        magic_chest_number: number;
    };
    avatars: Array<{
        id: number;
        name: string;
        level: number;
        rarity: number;
        fetter: number;
        element: string;
        actived_constellation_num: number;
    }>;
    world_explorations: Array<{
        name: string;
        exploration_percentage: number;
        level: number;
    }>;
}
export interface SrIndexData {
    game: 'sr';
    uid: string;
    stats: {
        active_days: number;
        avatar_num: number;
        achievement_num: number;
        chest_num: number;
        abyss_process: string;
    };
    avatar_list: Array<{
        id: number;
        name: string;
        level: number;
        rarity: number;
        rank: number;
        element: string;
    }>;
}
export interface ZzzIndexData {
    game: 'zzz';
    uid: string;
    stats: {
        active_days: number;
        avatar_num: number;
        buddy_num: number;
        achievement_count: number;
        cur_period_zone_layer_count: number;
    };
    avatar_list: Array<{
        id: number;
        name_mi18n: string;
        full_name_mi18n: string;
        level: number;
        rarity: string;
        rank: number;
        element_type: number;
        camp_name_mi18n: string;
    }>;
}
export type PlayerIndexData = GsIndexData | SrIndexData | ZzzIndexData;
export interface PlayerIndexCardProps {
    data: PlayerIndexData;
}
export default function PlayerIndexCard({ data }: PlayerIndexCardProps): React.JSX.Element;
