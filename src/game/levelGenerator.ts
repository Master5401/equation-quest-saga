
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
  const width = 20 + Math.min(10, levelNum); // Increasing width with level
  const height = 12 + Math.min(6, Math.floor(levelNum/2)); // Increasing height with level
  
  // Initialize map with walls
  const map: string[][] = Array(height).fill(0).map(() => 
    Array(width).fill(SYMBOLS.WALL)
  );
  
  // Carve out rooms based on level complexity
  const roomCount = 3 + Math.min(Math.floor(levelNum/2), 5);
  const roomSizes = [
    {width: 4, height: 3},  // Small rooms
    {width: 6, height: 4},  // Medium rooms
    {width: 8, height: 6}   // Large rooms
  ];
  
  const rooms = [];
  for (let i = 0; i < roomCount; i++) {
    // Higher levels have more varied room sizes
    const roomSizeIndex = Math.min(
      Math.floor(Math.random() * (1 + Math.floor(levelNum/2))), 
      roomSizes.length - 1
    );
    const roomSize = roomSizes[roomSizeIndex];
    
    const roomX = Math.floor(Math.random() * (width - roomSize.width - 2)) + 1;
    const roomY = Math.floor(Math.random() * (height - roomSize.height - 2)) + 1;
    
    // Carve out room
    for (let y = roomY; y < roomY + roomSize.height; y++) {
      for (let x = roomX; x < roomX + roomSize.width; x++) {
        map[y][x] = SYMBOLS.EMPTY;
      }
    }
    
    rooms.push({
      x: roomX,
      y: roomY,
      width: roomSize.width,
      height: roomSize.height,
      centerX: roomX + Math.floor(roomSize.width/2),
      centerY: roomY + Math.floor(roomSize.height/2)
    });
  }
  
  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const startRoom = rooms[i];
    const endRoom = rooms[i + 1];
    
    // Randomly decide corridor approach
    const vertical = Math.random() > 0.5;
    
    if (vertical) {
      // Vertical then horizontal
      for (let y = Math.min(startRoom.centerY, endRoom.centerY); y <= Math.max(startRoom.centerY, endRoom.centerY); y++) {
        if (y >= 0 && y < height) map[y][startRoom.centerX] = SYMBOLS.EMPTY;
      }
      for (let x = Math.min(startRoom.centerX, endRoom.centerX); x <= Math.max(startRoom.centerX, endRoom.centerX); x++) {
        if (x >= 0 && x < width) map[endRoom.centerY][x] = SYMBOLS.EMPTY;
      }
    } else {
      // Horizontal then vertical
      for (let x = Math.min(startRoom.centerX, endRoom.centerX); x <= Math.max(startRoom.centerX, endRoom.centerX); x++) {
        if (x >= 0 && x < width) map[startRoom.centerY][x] = SYMBOLS.EMPTY;
      }
      for (let y = Math.min(startRoom.centerY, endRoom.centerY); y <= Math.max(startRoom.centerY, endRoom.centerY); y++) {
        if (y >= 0 && y < height) map[y][endRoom.centerX] = SYMBOLS.EMPTY;
      }
    }
  }
  
  const enemies: Record<string, Enemy> = {};
  let startX = rooms[0].centerX; 
  let startY = rooms[0].centerY;
  
  // Find empty positions for entities
  const emptyPositions = getEmptyPositions(map);
  
  // Place items based on level difficulty
  const itemCount = Math.min(Math.ceil(levelNum/2), 5); // More items in higher levels
  const itemSymbols = [SYMBOLS.ITEM_INTEGRATE, SYMBOLS.ITEM_DIFFERENTIATE, SYMBOLS.ITEM_MULTIPLY];
  
  for (let i = 0; i < itemCount; i++) {
    if (emptyPositions.length > 0) {
      const itemSymbol = itemSymbols[Math.floor(Math.random() * itemSymbols.length)];
      const pos = removeRandomPosition(emptyPositions);
      map[pos.y][pos.x] = itemSymbol;
    }
  }
  
  // Place enemies with increasing complexity based on level
  const enemySymbols = [
    SYMBOLS.ENEMY_ADD,      // Always available
    SYMBOLS.ENEMY_SUBTRACT, // Always available
    SYMBOLS.ENEMY_MULTIPLY, // Available after level 2
    SYMBOLS.ENEMY_DIVIDE    // Available after level 3
  ];
  
  // Special enemies for certain levels
  if (levelNum >= 4) enemySymbols.push(SYMBOLS.ENEMY_INTEGRATE);  // Integration enemies after level 4
  if (levelNum >= 5) enemySymbols.push(SYMBOLS.ENEMY_DERIVATIVE); // Derivative enemies after level 5
  
  // Number of enemies increases with level
  const numEnemies = Math.min(3 + Math.floor(levelNum * 1.5), 12);
  
  for (let i = 0; i < numEnemies; i++) {
    if (emptyPositions.length > 0) {
      // Higher levels have more advanced enemies
      const availableEnemies = enemySymbols.slice(0, Math.min(2 + Math.floor(levelNum/2), enemySymbols.length));
      const enemySymbol = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
      const pos = removeRandomPosition(emptyPositions);
      map[pos.y][pos.x] = enemySymbol;
      
      // Create enemy object
      const enemy = createEnemy(enemySymbol, levelNum, pos);
      enemies[posToKey(pos)] = enemy;
    }
  }
  
  // Place player start position in the first room
  startX = rooms[0].centerX;
  startY = rooms[0].centerY;
  
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
    case SYMBOLS.ENEMY_INTEGRATE:
      color = "#00FFFF"; // Cyan
      baseTileColor = "#007777"; // Darker cyan
      operation = "integration";
      break;
    case SYMBOLS.ENEMY_DERIVATIVE:
      color = "#0080FF"; // Blue
      baseTileColor = "#004080"; // Darker blue
      operation = "differentiation";
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

// Generate a puzzle based on the enemy and level difficulty
export const generatePuzzle = (enemy: Enemy): { puzzleText: string, puzzleAnswer: number | string } => {
  const d = Math.max(1, enemy.difficulty);
  
  switch(enemy.operation) {
    case "addition":
      if (d <= 2) {
        // Simple addition
        const a = Math.floor(Math.random() * (10 * d)) + 1;
        const b = Math.floor(Math.random() * (10 * d)) + 1;
        return { puzzleText: `${a} + ${b} = ?`, puzzleAnswer: a + b };
      } else if (d <= 4) {
        // Multiple terms addition
        const a = Math.floor(Math.random() * (10 * d)) + 1;
        const b = Math.floor(Math.random() * (10 * d)) + 1;
        const c = Math.floor(Math.random() * (10 * d)) + 1;
        return { puzzleText: `${a} + ${b} + ${c} = ?`, puzzleAnswer: a + b + c };
      } else {
        // Complex addition with negative numbers
        const a = Math.floor(Math.random() * (10 * d)) * (Math.random() > 0.5 ? 1 : -1);
        const b = Math.floor(Math.random() * (10 * d)) * (Math.random() > 0.5 ? 1 : -1);
        const c = Math.floor(Math.random() * (10 * d)) * (Math.random() > 0.5 ? 1 : -1);
        return { 
          puzzleText: `${a < 0 ? `(${a})` : a} + ${b < 0 ? `(${b})` : b} + ${c < 0 ? `(${c})` : c} = ?`, 
          puzzleAnswer: a + b + c 
        };
      }
      
    case "subtraction":
      if (d <= 2) {
        // Simple subtraction
        const b = Math.floor(Math.random() * (10 * d)) + 1;
        const a = Math.floor(Math.random() * (10 * d)) + b; // Ensure positive result
        return { puzzleText: `${a} - ${b} = ?`, puzzleAnswer: a - b };
      } else if (d <= 4) {
        // Multiple terms subtraction
        const c = Math.floor(Math.random() * (8 * d)) + 1;
        const b = Math.floor(Math.random() * (8 * d)) + c;
        const a = Math.floor(Math.random() * (8 * d)) + b + c;
        return { puzzleText: `${a} - ${b} - ${c} = ?`, puzzleAnswer: a - b - c };
      } else {
        // Complex subtraction with parentheses
        const a = Math.floor(Math.random() * (15 * d)) + 10;
        const b = Math.floor(Math.random() * (10 * d)) + 5;
        const c = Math.floor(Math.random() * (5 * d)) + 1;
        return { puzzleText: `${a} - (${b} - ${c}) = ?`, puzzleAnswer: a - (b - c) };
      }
      
    case "multiplication":
      if (d <= 2) {
        // Simple multiplication
        const a = Math.floor(Math.random() * (6 * d)) + 1;
        const b = Math.floor(Math.random() * (6 * d)) + 1;
        return { puzzleText: `${a} × ${b} = ?`, puzzleAnswer: a * b };
      } else if (d <= 4) {
        // Multiply by powers of 10
        const a = Math.floor(Math.random() * (100)) + 10;
        const power = Math.floor(Math.random() * 3) + 1;
        const multiplier = Math.pow(10, power);
        return { puzzleText: `${a} × 10^${power} = ?`, puzzleAnswer: a * multiplier };
      } else {
        // Distributive property
        const a = Math.floor(Math.random() * (10)) + 1;
        const b = Math.floor(Math.random() * (10)) + 1;
        const c = Math.floor(Math.random() * (10)) + 1;
        return { puzzleText: `${a}(${b} + ${c}) = ?`, puzzleAnswer: a * (b + c) };
      }
      
    case "division":
      if (d <= 2) {
        // Simple integer division
        const quotient = Math.floor(Math.random() * (5 * d)) + 1;
        const divB = Math.floor(Math.random() * (5 * d)) + 1;
        const divA = divB * quotient; // Ensure integer division
        return { puzzleText: `${divA} ÷ ${divB} = ?`, puzzleAnswer: quotient };
      } else if (d <= 4) {
        // Division with remainder or decimal
        const divB = Math.floor(Math.random() * (d * 5)) + 2;
        const divA = divB * Math.floor(Math.random() * 5) + Math.floor(Math.random() * divB);
        const exactAnswer = divA / divB;
        // Format as fraction if not an integer
        const formattedAnswer = Number.isInteger(exactAnswer) ? exactAnswer : `${divA}/${divB}`;
        return { puzzleText: `${divA} ÷ ${divB} = ?`, puzzleAnswer: formattedAnswer };
      } else {
        // Complex division
        const a = Math.floor(Math.random() * (20)) + 10;
        const b = Math.floor(Math.random() * (10)) + 2;
        const c = Math.floor(Math.random() * (5)) + 1;
        return { puzzleText: `(${a} × ${c}) ÷ ${b} = ?`, puzzleAnswer: (a * c) / b };
      }
    
    case "integration":
      // Basic integration problems
      const coefficients = [1, 2, 3, 4, 5];
      const coef = coefficients[Math.floor(Math.random() * coefficients.length)];
      const powers = [1, 2, 3]; // x, x², x³
      const power = powers[Math.floor(Math.random() * powers.length)];
      
      // For power = 1: ∫x dx = x²/2
      // For power = 2: ∫x² dx = x³/3
      // For power = 3: ∫x³ dx = x⁴/4
      const answer = coef * (1 / (power + 1));
      
      let puzzleText = `∫ ${coef}x`;
      if (power > 1) puzzleText += `^${power}`;
      puzzleText += ` dx = ?`;
      
      return { puzzleText, puzzleAnswer: answer };
      
    case "differentiation":
      // Basic differentiation problems
      const diffCoef = Math.floor(Math.random() * 5) + 1;
      const diffPower = Math.floor(Math.random() * 4) + 1;
      
      // d/dx(diffCoef * x^diffPower) = diffCoef * diffPower * x^(diffPower-1)
      const diffAnswer = diffCoef * diffPower;
      
      let diffText = `d/dx(${diffCoef}x`;
      if (diffPower > 1) diffText += `^${diffPower}`;
      diffText += `) = ?`;
      
      // If power is 1, then answer is just coefficient
      // If power is > 1, we're calculating at x=1 for simplicity
      return { puzzleText: diffText, puzzleAnswer: diffAnswer };
      
    default:
      return { puzzleText: `${d} + ${d} = ?`, puzzleAnswer: 2 * d }; // Fallback
  }
};

// Check if a level is complete (no enemies left)
export const isLevelComplete = (level: Level): boolean => {
  return Object.keys(level.enemies).length === 0;
};
