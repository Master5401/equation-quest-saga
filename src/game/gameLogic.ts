
import { GameData, Player, Level, Enemy, Position } from './types';
import { GameState, SYMBOLS, MAX_LEVELS } from './constants';
import { posToKey, generateLevel, generatePuzzle, isLevelComplete } from './levelGenerator';

// Initialize the player
export const initializePlayer = (level: Level): Player => {
  return {
    x: level.startX,
    y: level.startY,
    symbol: SYMBOLS.PLAYER,
    health: 100,
    score: 0,
    inventory: [],
    abilities: ["add"]
  };
};

// Move the player
export const movePlayer = (
  gameData: GameData, 
  dx: number, 
  dy: number
): GameData => {
  if (!gameData.player || !gameData.level || gameData.state !== GameState.PLAYING) {
    return gameData;
  }
  
  const { player, level } = gameData;
  const newX = player.x + dx;
  const newY = player.y + dy;
  
  // Check if the new position is valid
  if (newX < 0 || newX >= level.map[0].length || newY < 0 || newY >= level.map.length) {
    return gameData; // Out of bounds
  }
  
  const tile = level.map[newY][newX];
  
  // Handle wall collision
  if (tile === SYMBOLS.WALL) {
    return gameData;
  }
  
  // Handle enemy encounter
  if ([SYMBOLS.ENEMY_ADD, SYMBOLS.ENEMY_SUBTRACT, SYMBOLS.ENEMY_MULTIPLY, SYMBOLS.ENEMY_DIVIDE].includes(tile)) {
    const enemyKey = posToKey({ x: newX, y: newY });
    const enemy = level.enemies[enemyKey];
    
    if (enemy) {
      const { puzzleText, puzzleAnswer } = generatePuzzle(enemy);
      
      return {
        ...gameData,
        level: {
          ...level,
          currentEnemy: enemy,
          puzzleText,
          puzzleAnswer,
          userAnswer: ""
        },
        state: GameState.PUZZLE,
      };
    }
  }
  
  // Handle item collection
  if ([SYMBOLS.ITEM_INTEGRATE, SYMBOLS.ITEM_DIFFERENTIATE, SYMBOLS.ITEM_MULTIPLY].includes(tile)) {
    const updatedPlayer = collectItem(player, tile);
    const updatedMap = [...level.map];
    updatedMap[newY][newX] = SYMBOLS.EMPTY; // Remove item from map
    
    return {
      ...gameData,
      player: {
        ...updatedPlayer,
        x: newX,
        y: newY
      },
      level: {
        ...level,
        map: updatedMap
      },
      message: `Collected ${getItemName(tile)}!`,
      messageTimer: 90
    };
  }
  
  // Move to empty space
  return {
    ...gameData,
    player: {
      ...player,
      x: newX,
      y: newY
    }
  };
};

// Collect an item
const collectItem = (player: Player, itemSymbol: string): Player => {
  const updatedInventory = player.inventory.includes(itemSymbol) 
    ? player.inventory 
    : [...player.inventory, itemSymbol];
  
  const updatedAbilities = [...player.abilities];
  let scoreIncrease = 25;
  
  switch (itemSymbol) {
    case SYMBOLS.ITEM_INTEGRATE:
      if (!updatedAbilities.includes("integrate")) {
        updatedAbilities.push("integrate");
      }
      break;
    case SYMBOLS.ITEM_DIFFERENTIATE:
      if (!updatedAbilities.includes("differentiate")) {
        updatedAbilities.push("differentiate");
      }
      break;
    case SYMBOLS.ITEM_MULTIPLY:
      if (!updatedAbilities.includes("multiply")) {
        updatedAbilities.push("multiply");
      }
      break;
  }
  
  return {
    ...player,
    inventory: updatedInventory,
    abilities: updatedAbilities,
    score: player.score + scoreIncrease
  };
};

// Get a human-readable name for an item
const getItemName = (itemSymbol: string): string => {
  switch (itemSymbol) {
    case SYMBOLS.ITEM_INTEGRATE:
      return "Integration Symbol";
    case SYMBOLS.ITEM_DIFFERENTIATE:
      return "Differentiation Symbol";
    case SYMBOLS.ITEM_MULTIPLY:
      return "Product Symbol";
    default:
      return "Unknown Item";
  }
};

// Check a puzzle answer
export const checkPuzzleAnswer = (gameData: GameData): GameData => {
  if (!gameData.level?.currentEnemy || !gameData.player) {
    return gameData;
  }
  
  const { level, player } = gameData;
  const { userAnswer, puzzleAnswer } = level;
  
  try {
    if (parseInt(userAnswer) === puzzleAnswer) {
      // Answer is correct
      const enemyKey = posToKey(level.currentEnemy.position);
      const updatedMap = [...level.map];
      updatedMap[level.currentEnemy.position.y][level.currentEnemy.position.x] = SYMBOLS.EMPTY;
      
      const updatedEnemies = { ...level.enemies };
      delete updatedEnemies[enemyKey];
      
      const updatedLevel = {
        ...level,
        map: updatedMap,
        enemies: updatedEnemies,
        currentEnemy: null
      };
      
      // Check if this was the last enemy
      const levelComplete = Object.keys(updatedEnemies).length === 0;
      
      return {
        ...gameData,
        player: {
          ...player,
          score: player.score + 50
        },
        level: updatedLevel,
        state: GameState.PLAYING,
        message: "Correct!",
        messageTimer: 60,
        flashColor: "#00FF00", // Green flash
        flashTimer: 10
      };
    } else {
      // Answer is wrong
      const newHealth = player.health - 10;
      
      if (newHealth <= 0) {
        return {
          ...gameData,
          player: {
            ...player,
            health: 0
          },
          state: GameState.GAME_OVER,
          flashColor: "#FF0000", // Red flash
          flashTimer: 10
        };
      }
      
      return {
        ...gameData,
        player: {
          ...player,
          health: newHealth
        },
        level: {
          ...level,
          userAnswer: ""
        },
        message: "Wrong! -10 Health. Try again.",
        messageTimer: 60,
        flashColor: "#FF0000", // Red flash
        flashTimer: 10
      };
    }
  } catch (e) {
    return {
      ...gameData,
      message: "Please enter a valid number.",
      messageTimer: 60
    };
  }
};

// Start a new game
export const startGame = (): GameData => {
  const level = generateLevel(1);
  const player = initializePlayer(level);
  
  return {
    state: GameState.PLAYING,
    level,
    player,
    currentLevel: 1,
    message: "Level 1 Start!",
    messageTimer: 90,
    flashColor: null,
    flashTimer: 0
  };
};

// Advance to the next level
export const nextLevel = (gameData: GameData): GameData => {
  if (!gameData.player) return gameData;
  
  const nextLevelNum = gameData.currentLevel + 1;
  
  if (nextLevelNum > MAX_LEVELS) {
    return {
      ...gameData,
      state: GameState.VICTORY
    };
  }
  
  const level = generateLevel(nextLevelNum);
  
  return {
    ...gameData,
    level,
    player: {
      ...gameData.player,
      x: level.startX,
      y: level.startY
    },
    currentLevel: nextLevelNum,
    message: `Level ${nextLevelNum} Start!`,
    messageTimer: 90
  };
};

// Update game state on each frame
export const updateGame = (gameData: GameData): GameData => {
  let updatedGame = { ...gameData };
  
  // Update message timer
  if (updatedGame.messageTimer > 0) {
    updatedGame.messageTimer -= 1;
  }
  
  // Update flash timer
  if (updatedGame.flashTimer > 0) {
    updatedGame.flashTimer -= 1;
  } else {
    updatedGame.flashColor = null;
  }
  
  // Check for level completion
  if (updatedGame.state === GameState.PLAYING && 
      updatedGame.level && 
      Object.keys(updatedGame.level.enemies).length === 0) {
    updatedGame = nextLevel(updatedGame);
  }
  
  return updatedGame;
};

// Update user puzzle answer
export const updatePuzzleAnswer = (gameData: GameData, answer: string): GameData => {
  if (!gameData.level) return gameData;
  
  return {
    ...gameData,
    level: {
      ...gameData.level,
      userAnswer: answer
    }
  };
};

// Reset the game
export const resetGame = (): GameData => {
  return {
    state: GameState.TITLE_SCREEN,
    level: null,
    player: null,
    currentLevel: 1,
    message: "",
    messageTimer: 0,
    flashColor: null,
    flashTimer: 0
  };
};
