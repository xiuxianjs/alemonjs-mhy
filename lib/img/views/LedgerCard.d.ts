import React from 'react';
interface LedgerGroupItem {
    action_id?: number;
    action?: string;
    action_name: string;
    num: number;
    percent: number;
}
export interface GsLedgerData {
    game: 'gs';
    uid: string;
    data_month: number;
    month_data: {
        current_primogems: number;
        current_mora: number;
        last_primogems: number;
        last_mora: number;
        primogem_rate: number;
        mora_rate: number;
        group_by: LedgerGroupItem[];
    };
    day_data: {
        current_primogems: number;
        current_mora: number;
    };
}
export interface SrLedgerData {
    game: 'sr';
    uid: string;
    data_month: string;
    month_data: {
        current_hcoin: number;
        current_rails_pass: number;
        last_hcoin: number;
        last_rails_pass: number;
        hcoin_rate: number;
        rails_rate: number;
        group_by: LedgerGroupItem[];
    };
    day_data: {
        current_hcoin: number;
        current_rails_pass: number;
    };
}
export type LedgerData = GsLedgerData | SrLedgerData;
export interface LedgerCardProps {
    data: LedgerData;
}
export default function LedgerCard({ data }: LedgerCardProps): React.JSX.Element;
export {};
