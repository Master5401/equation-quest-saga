
import { SYMBOLS } from './constants';
import { Level, Enemy, Position } from './types';

// Generate a key from a position
export const posToKey = (pos: Position): string => `${pos.x},${pos.y}`;
export const keyToPos = (key: string): Position => {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
};

// Generate a level
export const generateLevel = (levelNum: number): Level => {
  const width = 20;
  const height = 12;
  
  // Initialize map with walls
  const map: string[][] = Array(height).fill(0).map(() => 
    Array(width).fill(SYMBOLS.WALL)
  );
  
  // Carve out rooms
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (Math.random() > 0.2) { // 80% chance of being empty
        map[y][x] = SYMBOLS.EMPTY;
      }
    }
  }
  
  // Ensure connectivity (basic path from center to edges)
  for (let y = 1; y < height - 1; y++) {
    map[y][Math.floor(width / 2)] = SYMBOLS.EMPTY;
  }
  
  for (let x = 1; x < width - 1; x++) {
    map[Math.floor(height / 2)][x] = SYMBOLS.EMPTY;
  }
  
  const enemies: Record<string, Enemy> = {};
  let startX = 1; 
  let startY = 1;
  
  // Find empty positions for entities
  const emptyPositions = getEmptyPositions(map);
  
  // Place items
  const itemSymbols = [SYMBOLS.ITEM_INTEGRATE, SYMBOLS.ITEM_DIFFERENTIATE, SYMBOLS.ITEM_MULTIPLY];
  for (const itemSymbol of itemSymbols) {
    if (emptyPositions.length > 0) {
      const pos = removeRandomPosition(emptyPositions);
      map[pos.y][pos.x] = itemSymbol;
    }
  }
  
  // Place enemies
  const enemySymbols = [SYMBOLS.ENEMY_ADD, SYMBOLS.ENEMY_SUBTRACT, SYMBOLS.ENEMY_MULTIPLY, SYMBOLS.ENEMY_DIVIDE];
  const numEnemies = Math.min(levelNum + 1, enemySymbols.length * 2);
  
  for (let i = 0; i < numEnemies; i++) {
    if (emptyPositions.length > 0) {
      const enemySymbol = enemySymbols[Math.floor(Math.random() * enemySymbols.length)];
      const pos = removeRandomPosition(emptyPositions);
      map[pos.y][pos.x] = enemySymbol;
      
      // Create enemy object
      const enemy = createEnemy(enemySymbol, levelNum, pos);
      enemies[posToKey(pos)] = enemy;
    }
  }
  
  // Place player start position
  if (emptyPositions.length > 0) {
    const startPos = removeRandomPosition(emptyPositions);
    startX = startPos.x;
    startY = startPos.y;
  }
  
  return {
    levelNum,
    map,
    enemies,
    startX,
    startY,
    currentEnemy: null,
    puzzleText: "",
    puzzleAnswer: 0,
    userAnswer: ""
  };
};

// Get all empty positions in the map
const getEmptyPositions = (map: string[][]): Position[] => {
  const positions: Position[] = [];
  
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] === SYMBOLS.EMPTY) {
        positions.push({ x, y });
      }
    }
  }
  
  return positions;
};

// Remove and return a random position from the list
const removeRandomPosition = (positions: Position[]): Position => {
  const index = Math.floor(Math.random() * positions.length);
  const pos = positions[index];
  positions.splice(index, 1);
  return pos;
};

// Create an enemy object based on symbol
const createEnemy = (symbol: string, difficulty: number, position: Position): Enemy => {
  let color = "#FFFFFF";
  let baseTileColor = "#808080";
  let operation = "unknown";
  
  switch (symbol) {
    case SYMBOLS.ENEMY_ADD:
      color = "#FF0000"; // Bright red
      baseTileColor = "#960000"; // Darker red
      operation = "addition";
      break;
    case SYMBOLS.ENEMY_SUBTRACT:
      color = "#800000"; // Dark red
      baseTileColor = "#500000"; // Even darker red
      operation = "subtraction";
      break;
    case SYMBOLS.ENEMY_MULTIPLY:
      color = "#FF00FF"; // Bright magenta
      baseTileColor = "#960096"; // Darker magenta
      operation = "multiplication";
      break;
    case SYMBOLS.ENEMY_DIVIDE:
      color = "#800080"; // Dark magenta
      baseTileColor = "#500050"; // Even darker magenta
      operation = "division";
      break;
  }
  
  return {
    symbol,
    color,
    baseTileColor,
    operation,
    difficulty,
    position
  };
};

// Generate a puzzle based on the enemy
export const generatePuzzle = (enemy: Enemy): { puzzleText: string, puzzleAnswer: number } => {
  const d = Math.max(1, enemy.difficulty);
  
  switch(enemy.operation) {
    case "addition":
      const addA = Math.floor(Math.random() * (10 * d)) + 1;
      const addB = Math.floor(Math.random() * (10 * d)) + 1;
      return { puzzleText: `${addA} + ${addB} = ?`, puzzleAnswer: addA + addB };
      
    case "subtraction":
      const subB = Math.floor(Math.random() * (10 * d)) + 1;
      const subA = Math.floor(Math.random() * (10 * d)) + subB; // Ensure positive result
      return { puzzleText: `${subA} - ${subB} = ?`, puzzleAnswer: subA - subB };
      
    case "multiplication":
      const mulA = Math.floor(Math.random() * (6 * d)) + 1;
      const mulB = Math.floor(Math.random() * (6 * d)) + 1;
      return { puzzleText: `${mulA} × ${mulB} = ?`, puzzleAnswer: mulA * mulB };
      
    case "division":
      const quotient = Math.floor(Math.random() * (5 * d)) + 1;
      const divB = Math.floor(Math.random() * (5 * d)) + 1;
      const divA = divB * quotient; // Ensure integer division
      return { puzzleText: `${divA} ÷ ${divB} = ?`, puzzleAnswer: quotient };
      
    default:
      return { puzzleText: `${d} + ${d} = ?`, puzzleAnswer: 2 * d }; // Fallback
  }
};

// Check if a level is complete (no enemies left)
export const isLevelComplete = (level: Level): boolean => {
  return Object.keys(level.enemies).length === 0;
};
