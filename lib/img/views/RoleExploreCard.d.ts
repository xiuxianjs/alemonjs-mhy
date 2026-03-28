import React from 'react';
export interface GsExploreData {
    game: 'gs';
    uid: string;
    stats: {
        achievement_number: number;
        avatar_number: number;
        luxurious_chest_number: number;
        precious_chest_number: number;
        exquisite_chest_number: number;
        common_chest_number: number;
        magic_chest_number: number;
        anemoculus_number: number;
        geoculus_number: number;
        electroculus_number: number;
        dendroculus_number: number;
        hydroculus_number: number;
        pyroculus_number: number;
    };
    homes: Array<{
        level: number;
        comfort_num: number;
        item_num: number;
        name: string;
    }>;
    world_explorations: Array<{
        name: string;
        exploration_percentage: number;
        level: number;
        offerings: Array<{
            name: string;
            level: number;
        }>;
    }>;
}
export interface SrExploreData {
    game: 'sr';
    uid: string;
    stats: {
        active_days: number;
        avatar_num: number;
        achievement_num: number;
        chest_num: number;
        abyss_process: string;
    };
}
export interface ZzzExploreData {
    game: 'zzz';
    uid: string;
    stats: {
        active_days: number;
        avatar_num: number;
        buddy_num: number;
        achievement_count: number;
        cur_period_zone_layer_count: number;
        world_level_name: string;
    };
}
export type RoleExploreData = GsExploreData | SrExploreData | ZzzExploreData;
export interface RoleExploreCardProps {
    data: RoleExploreData;
}
export default function RoleExploreCard({ data }: RoleExploreCardProps): React.JSX.Element;
