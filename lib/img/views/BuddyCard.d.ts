import React from 'react';
export interface BuddyItem {
    id: number;
    name: string;
    rarity: string;
    level: number;
    star: number;
}
export interface BuddyCardData {
    uid: string;
    list: BuddyItem[];
}
export interface BuddyCardProps {
    data: BuddyCardData;
}
export default function BuddyCard({ data }: BuddyCardProps): React.JSX.Element;
