
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
}

export interface Enemy {
  symbol: string;
  color: string;
  baseTileColor: string;
  operation: string;
  difficulty: number;
  position: Position;
}

export interface Level {
  levelNum: number;
  map: string[][];
  enemies: Record<string, Enemy>;
  startX: number;
  startY: number;
  currentEnemy: Enemy | null;
  puzzleText: string;
  puzzleAnswer: number;
  userAnswer: string;
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
}

export interface TitleSymbol {
  char: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}
