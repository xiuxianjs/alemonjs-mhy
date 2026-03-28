export interface SignResult {
    success: boolean;
    message: string;
    details: SignRoleResult[];
}
export interface SignRoleResult {
    gameName: string;
    nickname: string;
    uid: string;
    signed: boolean;
    alreadySigned: boolean;
    totalDays: number;
    reward?: string;
    error?: string;
}
export declare const performGameSign: (userId: string, gameKey?: string) => Promise<SignResult>;
export declare const resolveSignGameKey: (text: string) => string | undefined;
export interface BbsSignResult {
    success: boolean;
    message: string;
}
export declare const performBbsSign: (userId: string) => Promise<BbsSignResult>;
