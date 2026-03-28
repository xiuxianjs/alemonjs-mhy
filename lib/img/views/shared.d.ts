export interface GameTheme {
    name: string;
    gradient: string;
    accent: string;
    headerText: string;
    headerSub: string;
    progressColor: string;
}
export declare const GAME_THEME: Record<string, GameTheme>;
export declare const RARITY_COLORS: Record<number, string>;
export declare const RARITY_COLORS_STR: Record<string, string>;
export declare function formatDate(): string;
export declare function getTheme(game: string): GameTheme;
