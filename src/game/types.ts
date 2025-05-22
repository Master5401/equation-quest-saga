import { GameState } from './constants';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  symbol: string;
  health: number;
  score: number;
  inventory: string[];
  abilities: string[];
  powerups: {
    shield: number;
    time: number;
    scoreMultiplier: number;
  };
  combo: number;
  lastMoveTime: number;
}

export interface Enemy {
  symbol: string;
  color: string;
  baseTileColor: string;
  operation: string;
  difficulty: number;
  position: Position;
  movePattern?: string;
  speed?: number;
  lastMoveTime?: number;
}

export interface PowerUp {
  symbol: string;
  type: string;
  position: Position;
  effect: {
    amount: number;
    duration: number;
  };
}

export interface Level {
  levelNum: number;
  map: string[][];
  enemies: Record<string, Enemy>;
  powerups: Record<string, PowerUp>;
  startX: number;
  startY: number;
  currentEnemy: Enemy | null;
  puzzleText: string;
  puzzleAnswer: number;
  userAnswer: string;
  timeLimit?: number;
  theme?: string;
}

export interface GameData {
  state: GameState;
  level: Level | null;
  player: Player | null;
  currentLevel: number;
  message: string;
  messageTimer: number;
  flashColor: string | null;
  flashTimer: number;
  paused: boolean;
  combo: number;
  lastPuzzleTime: number;
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: string;
  };
}

export interface TitleSymbol {
  char: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

export interface Sound {
  src: string;
  volume?: number;
  loop?: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}