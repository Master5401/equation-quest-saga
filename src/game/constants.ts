
// Game Constants
export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;
export const TILE_SIZE = 48;
export const HUD_HEIGHT = 50;
export const FPS = 30;
export const MAX_LEVELS = 5;

// Game States
export enum GameState {
  TITLE_SCREEN = 0,
  PLAYING = 1,
  PUZZLE = 2,
  GAME_OVER = 3,
  VICTORY = 4
}

// Entity Symbols
export const SYMBOLS = {
  PLAYER: "π",
  WALL: "∑",
  ITEM_INTEGRATE: "∫",
  ITEM_DIFFERENTIATE: "∆",
  ITEM_MULTIPLY: "∏",
  ENEMY_ADD: "+",
  ENEMY_SUBTRACT: "-",
  ENEMY_MULTIPLY: "×",
  ENEMY_DIVIDE: "÷",
  EMPTY: " "
};

// Colors
export const COLORS = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  BRIGHT_GREEN: "#00FF00",
  BRIGHT_RED: "#FF0000",
  BRIGHT_BLUE: "#0000FF",
  BRIGHT_CYAN: "#00FFFF",
  BRIGHT_MAGENTA: "#FF00FF",
  BRIGHT_YELLOW: "#FFFF00",
  DARK_GREEN: "#006400",
  DARK_RED: "#800000",
  DARK_BLUE: "#000080",
  DARK_CYAN: "#008B8B",
  DARK_MAGENTA: "#800080",
  DARK_YELLOW: "#808000",
  GRAY: "#808080",
  LIGHT_GRAY: "#C0C0C0",
  VERY_DARK_GRAY: "#1E1E1E",
  MEDIUM_GRAY: "#3C3C3C"
};

// Title screen symbols
export const TITLE_SYMBOLS = ["∑", "∏", "∆", "√", "∞", "∫", "≠", "≤", "≥", "±", "÷", "×", "ƒ", "∂", "∇"];
