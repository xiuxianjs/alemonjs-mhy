import React from 'react';
export type QrStatus = 'waiting' | 'scanned' | 'confirmed' | 'expired' | 'error';
export interface QrLoginCardProps {
    data: {
        qrDataUrl: string;
        status: QrStatus;
        uidLines?: string[];
    };
}
export default function QrLoginCard({ data }: QrLoginCardProps): React.JSX.Element;
