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
  VICTORY = 4,
  PAUSED = 5  // New pause state
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
  ENEMY_INTEGRATE: "∫",
  ENEMY_DERIVATIVE: "∂",
  EMPTY: " ",
  // New power-up symbols
  POWERUP_HEALTH: "♥",
  POWERUP_SHIELD: "⚡",
  POWERUP_TIME: "⌛",
  POWERUP_SCORE: "★"
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
  MEDIUM_GRAY: "#3C3C3C",
  // New power-up colors
  POWERUP_HEALTH: "#FF69B4",
  POWERUP_SHIELD: "#4169E1",
  POWERUP_TIME: "#FFD700",
  POWERUP_SCORE: "#9370DB"
};

// Title screen symbols - expanded math symbols
export const TITLE_SYMBOLS = [
  "∑", "∏", "∆", "√", "∞", "∫", "≠", "≤", "≥", "±", "÷", "×", "ƒ", "∂", "∇", 
  "π", "θ", "λ", "Ω", "Ψ", "∀", "∃", "∴", "∵", "∈", "⊂", "∪", "∩", "α", "β",
  "γ", "δ", "ε", "ζ", "η", "κ", "μ", "σ", "τ", "φ", "χ"
];

// Mathematical formulas for easter eggs
export const MATH_FORMULAS = [
  "E = mc²",
  "F = G(m₁m₂)/r²",
  "eiπ + 1 = 0",
  "∇ × E = -∂B/∂t",
  "∫₀^∞ e^(-x²) dx = √π/2",
  "(a+b)² = a² + 2ab + b²",
  "limₓ→₀ sin(x)/x = 1",
  "∫eˣ dx = eˣ + C",
  "∇ · B = 0",
  "∇ · E = ρ/ε₀",
  "∇ × B = μ₀J + μ₀ε₀∂E/∂t"
];

// Game difficulty scaling factors
export const DIFFICULTY = {
  HEALTH_PENALTY: (level: number) => Math.min(5 + level * 2.5, 20), // Reduced max penalty
  SCORE_REWARD: (level: number) => 50 + level * 15, // Increased rewards
  PUZZLE_TIMER: (level: number) => Math.max(35 - level * 2.5, 20), // More generous timer
  POWERUP_CHANCE: (level: number) => Math.min(0.15 + level * 0.05, 0.35), // Power-up spawn chance
  ENEMY_SPEED: (level: number) => Math.min(1 + level * 0.2, 2.5) // Enemy movement speed
};

// Power-up effects
export const POWERUP_EFFECTS = {
  HEALTH: {
    AMOUNT: 25, // Health restored
    DURATION: 0 // Instant effect
  },
  SHIELD: {
    AMOUNT: 0, // Blocks next hit
    DURATION: 300 // 10 seconds at 30 FPS
  },
  TIME: {
    AMOUNT: 0, // Slows enemies
    DURATION: 150 // 5 seconds at 30 FPS
  },
  SCORE: {
    AMOUNT: 100, // Bonus score
    DURATION: 0 // Instant effect
  }
};

// Sound effects configuration
export const SOUND_CONFIG = {
  VOLUME: 0.5,
  EFFECTS: {
    COLLECT: { src: "https://assets.mixkit.co/active_storage/sfx/2019/collect-item.wav" },
    HIT: { src: "https://assets.mixkit.co/active_storage/sfx/2034/hit.wav" },
    POWERUP: { src: "https://assets.mixkit.co/active_storage/sfx/2044/powerup.wav" },
    VICTORY: { src: "https://assets.mixkit.co/active_storage/sfx/2013/victory.wav" },
    GAME_OVER: { src: "https://assets.mixkit.co/active_storage/sfx/2015/game-over.wav" }
  },
  MUSIC: {
    TITLE: { src: "https://assets.mixkit.co/active_storage/music/title-theme.mp3" },
    GAME: { src: "https://assets.mixkit.co/active_storage/music/game-theme.mp3" }
  }
};