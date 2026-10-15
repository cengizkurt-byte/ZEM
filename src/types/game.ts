export type GameColor = 'blue' | 'pinkRed' | 'yellow';

export interface ColorDefinition {
  id: GameColor;
  nameTr: string;
  hex: string;
  bgClass: string;
  hoverClass: string;
  activeClass: string;
  borderClass: string;
  ringClass: string;
  badgeBg: string;
  badgeText: string;
}

export const GAME_COLORS: Record<GameColor, ColorDefinition> = {
  blue: {
    id: 'blue',
    nameTr: 'Mavi',
    hex: '#2563EB',
    bgClass: 'bg-[#2563EB]',
    hoverClass: 'hover:opacity-95',
    activeClass: 'active:scale-[0.97]',
    borderClass: 'border-transparent',
    ringClass: 'ring-blue-400',
    badgeBg: 'bg-blue-100 text-blue-800 border border-blue-200',
    badgeText: 'Mavi',
  },
  pinkRed: {
    id: 'pinkRed',
    nameTr: 'Pembe-Kırmızı',
    hex: '#E11D48',
    bgClass: 'bg-[#E11D48]',
    hoverClass: 'hover:opacity-95',
    activeClass: 'active:scale-[0.97]',
    borderClass: 'border-transparent',
    ringClass: 'ring-rose-400',
    badgeBg: 'bg-rose-100 text-rose-800 border border-rose-200',
    badgeText: 'Pembe-Kırmızı',
  },
  yellow: {
    id: 'yellow',
    nameTr: 'Sarı',
    hex: '#EAB308',
    bgClass: 'bg-[#EAB308]',
    hoverClass: 'hover:opacity-95',
    activeClass: 'active:scale-[0.97]',
    borderClass: 'border-transparent',
    ringClass: 'ring-amber-400',
    badgeBg: 'bg-amber-100 text-amber-900 border border-amber-300',
    badgeText: 'Sarı',
  },
};

export type GameStatus = 'MENU' | 'PLAYING' | 'FINISHED';

export interface RoundSquare {
  id: number;
  color: GameColor;
}

export interface RoundData {
  roundNumber: number;
  gridSize: 3 | 4;
  totalSquares: 9 | 16;
  activeColors: GameColor[];
  squares: RoundSquare[];
  colorCounts: Record<GameColor, number>;
  winningColor: GameColor;
  winningCount: number;
  stageName: string;
}

export interface WrongClickLog {
  roundNumber: number;
  chosenColor: GameColor;
  correctColor: GameColor;
  squareIndex: number;
  timestamp: number;
}

export interface GameStats {
  score: number;
  completedRounds: number;
  correctClicks: number;
  wrongClicks: number;
  accuracy: number;
  averageResponseTimeSec: number;
  maxStreak: number;
  currentStreak: number;
  roundResponseTimes: number[];
  wrongClickLogs: WrongClickLog[];
}
