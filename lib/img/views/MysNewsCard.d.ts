import React from 'react';
export interface NewsItem {
    subject: string;
    date: string;
}
export interface NewsDetailData {
    mode: 'detail';
    game: string;
    typeName: string;
    subject: string;
    date: string;
    content: string;
}
export interface NewsListData {
    mode: 'list';
    game: string;
    typeName: string;
    items: NewsItem[];
}
export type MysNewsData = NewsDetailData | NewsListData;
export interface MysNewsCardProps {
    data: MysNewsData;
}
export default function MysNewsCard({ data }: MysNewsCardProps): React.JSX.Element;
