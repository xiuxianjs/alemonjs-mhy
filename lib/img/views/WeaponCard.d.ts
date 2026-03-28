import React from 'react';
export interface AvatarWeapon {
    id: number;
    name: string;
    icon: string;
    type_name: string;
    rarity: number;
    level: number;
    affix_level: number;
}
export interface AvatarInfo {
    id: number;
    name: string;
    rarity: number;
    level: number;
    weapon: AvatarWeapon;
}
export interface WeaponCardData {
    uid: string;
    avatars: AvatarInfo[];
    filterText: string;
}
export interface WeaponCardProps {
    data: WeaponCardData;
}
export default function WeaponCard({ data }: WeaponCardProps): React.JSX.Element;
