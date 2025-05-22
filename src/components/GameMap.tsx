
import { useEffect, useRef, useState } from "react";
import { Level, Player, Position } from "@/game/types";
import { SYMBOLS, TILE_SIZE, MATH_FORMULAS } from "@/game/constants";
import { posToKey } from "@/game/levelGenerator";

interface GameMapProps {
  level: Level;
  player: Player;
  timeElapsed: number;
}

const GameMap = ({ level, player, timeElapsed }: GameMapProps) => {
  const mapWidth = level.map[0].length * TILE_SIZE;
  const mapHeight = level.map.length * TILE_SIZE;
  
  // Easter egg text that occasionally appears
  const [easterEgg, setEasterEgg] = useState<{text: string, x: number, y: number} | null>(null);
  
  // Occasionally show math formula easter eggs
  useEffect(() => {
    if (Math.random() < 0.005) { // 0.5% chance every animation frame
      const formula = MATH_FORMULAS[Math.floor(Math.random() * MATH_FORMULAS.length)];
      const x = Math.floor(Math.random() * level.map[0].length);
      const y = Math.floor(Math.random() * level.map.length);
      
      setEasterEgg({ text: formula, x, y });
      
      // Hide after a few seconds
      setTimeout(() => setEasterEgg(null), 3000);
    }
  }, [timeElapsed, level.map]);
  
  // Calculate centering offset
  const offsetX = Math.max(0, (800 - mapWidth) / 2);
  const offsetY = Math.max(50, (600 - mapHeight) / 2);

  return (
    <div className="relative font-mono" style={{ 
      width: `${mapWidth}px`, 
      height: `${mapHeight}px`,
      margin: '0 auto',
      transform: 'perspective(1200px) rotateX(10deg)',
      transformStyle: 'preserve-3d'
    }}>
      {/* Background grid for retro effect */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(rgba(0,50,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,50,0,0.2) 1px, transparent 1px)',
        backgroundSize: `${TILE_SIZE/2}px ${TILE_SIZE/2}px`,
        zIndex: -1
      }}></div>

      {/* Render all map tiles */}
      {level.map.map((row, y) => 
        row.map((tile, x) => {
          const isPlayer = player.x === x && player.y === y;
          return (
            <MapTile 
              key={`${x}-${y}`} 
              symbol={tile} 
              x={x} 
              y={y} 
              isPlayer={isPlayer}
              player={isPlayer ? player : null}
              enemy={level.enemies[posToKey({x, y})]}
              timeElapsed={timeElapsed}
              levelNum={level.levelNum}
            />
          );
        })
      )}
      
      {/* Easter egg floating formula */}
      {easterEgg && (
        <div 
          className="absolute text-yellow-300 text-sm bg-black/50 px-2 py-1 rounded z-20 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${easterEgg.x * TILE_SIZE + TILE_SIZE/2}px`,
            top: `${easterEgg.y * TILE_SIZE - 10}px`,
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          {easterEgg.text}
        </div>
      )}
    </div>
  );
};

interface MapTileProps {
  symbol: string;
  x: number; 
  y: number;
  isPlayer: boolean;
  player: Player | null;
  enemy: any;
  timeElapsed: number;
  levelNum: number;
}

const MapTile = ({ symbol, x, y, isPlayer, player, enemy, timeElapsed, levelNum }: MapTileProps) => {
  const tileRef = useRef<HTMLDivElement>(null);
  
  // Generate a pseudo-random value based on position for consistent randomness
  const pseudoRandom = (x * 31 + y * 17) % 100 / 100;
  
  // Apply varying styles for walls based on location for more visual interest
  const getWallStyle = () => {
    const baseStyles = "bg-black border border-blue-900";
    
    // Walls near the edge of the map are different
    if (x === 0 || y === 0) {
      return `${baseStyles} border-2 border-blue-700`;
    }
    
    // Some walls have different pattern based on position
    if ((x + y) % 7 === 0) {
      return `${baseStyles} border-dashed`;
    }
    
    // Some walls show mathematical symbols
    if ((x * y) % 11 === 0) {
      return `${baseStyles} text-blue-600 text-xs`;
    }
    
    return baseStyles;
  };

  // Position and size
  const tileStyle = {
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
    left: `${x * TILE_SIZE}px`,
    top: `${y * TILE_SIZE}px`,
    transition: 'transform 0.2s ease-out, background-color 0.2s ease',
    transform: isPlayer ? 'translateZ(10px) scale(1.05)' : 
               symbol === SYMBOLS.WALL ? `translateZ(${5 + pseudoRandom * 5}px)` : 
               'translateZ(0px)'
  };

  let tileClasses = "absolute flex items-center justify-center";
  let symbolElement = null;
  let symbolClasses = "math-symbol text-3xl";
  
  // Level-specific effects
  const levelEffect = () => {
    // Higher levels have more intense visual effects
    const intensityFactor = Math.min(1, levelNum / 5);
    const pulseSpeed = 0.1 + (levelNum * 0.02);
    
    // Pulse intensity varies by level
    const pulseIntensity = Math.sin(timeElapsed * pulseSpeed) * 0.2 * intensityFactor + 0.8;
    
    return {
      pulse: pulseIntensity,
      shadow: 5 + (levelNum * 0.5), // Shadow intensity increases with level
      transform: isPlayer ? `translateZ(${10 + levelNum}px) scale(1.05)` : 
                 symbol === SYMBOLS.WALL ? `translateZ(${5 + pseudoRandom * 5}px)` : 
                 'translateZ(0px)'
    };
  };
  
  const effects = levelEffect();

  // Handle different tile types with retro ASCII art style
  if (isPlayer && player) {
    // Player with pulse effect
    tileClasses += " bg-black border-2 border-green-500 z-10";
    symbolElement = (
      <div className={`${symbolClasses} text-green-400`}
           style={{ 
             textShadow: `0 0 ${effects.shadow}px rgba(0, 255, 0, ${effects.pulse})`,
           }}>
        {player.symbol}
      </div>
    );
  } else if (symbol === SYMBOLS.WALL) {
    // Wall with ASCII texture and varying patterns
    tileClasses += ` ${getWallStyle()}`;
    const wallPattern = ((x * 31 + y * 23) % 4);
    const wallPatterns = ['█', '▓', '▒', '░'];
    
    symbolElement = (
      <div className="text-blue-600 text-sm font-bold">
        {wallPatterns[wallPattern]}
      </div>
    );
  } else if ([SYMBOLS.ITEM_INTEGRATE, SYMBOLS.ITEM_DIFFERENTIATE, SYMBOLS.ITEM_MULTIPLY].includes(symbol)) {
    // Items with blinking effect
    const bobOffset = Math.sin(timeElapsed * 0.003 + x) * 4;
    const blinkIntensity = Math.sin(timeElapsed * 0.01 + x * 0.7) * 0.3 + 0.7;
    const levelColorIntensity = Math.min(0.5 + (levelNum * 0.1), 1);
    
    tileClasses += " bg-black border border-yellow-500 z-5";
    symbolElement = (
      <div 
        className={`${symbolClasses} text-yellow-500`}
        style={{ 
          transform: `translateY(${bobOffset}px)`,
          textShadow: `0 0 ${5 * levelColorIntensity}px rgba(255, 255, 0, ${blinkIntensity})`,
        }}
      >
        {symbol}
      </div>
    );
  } else if ([SYMBOLS.ENEMY_ADD, SYMBOLS.ENEMY_SUBTRACT, SYMBOLS.ENEMY_MULTIPLY, SYMBOLS.ENEMY_DIVIDE, SYMBOLS.ENEMY_INTEGRATE, SYMBOLS.ENEMY_DERIVATIVE].includes(symbol) && enemy) {
    // Enemies with pulsing effect
    const pulseOpacity = Math.abs(Math.sin(timeElapsed * 0.002)) * 0.4 + 0.4; // 0.4 to 0.8
    
    let borderColor = "border-red-500";
    let textColor = "text-red-500";
    
    if (symbol === SYMBOLS.ENEMY_SUBTRACT) {
      borderColor = "border-red-800";
      textColor = "text-red-800";
    } else if (symbol === SYMBOLS.ENEMY_MULTIPLY) {
      borderColor = "border-purple-500";
      textColor = "text-purple-500";
    } else if (symbol === SYMBOLS.ENEMY_DIVIDE) {
      borderColor = "border-purple-800";
      textColor = "text-purple-800";
    } else if (symbol === SYMBOLS.ENEMY_INTEGRATE) {
      borderColor = "border-blue-500";
      textColor = "text-blue-500";
    } else if (symbol === SYMBOLS.ENEMY_DERIVATIVE) {
      borderColor = "border-blue-800";
      textColor = "text-blue-800";
    }
    
    tileClasses += ` bg-black border-2 ${borderColor} z-5`;
    symbolElement = (
      <div className={`${symbolClasses} ${textColor}`}
           style={{ 
             opacity: pulseOpacity,
             textShadow: `0 0 5px currentColor`,
           }}>
        {symbol}
      </div>
    );
  } else {
    // Empty space with subtle grid pattern
    tileClasses += " bg-black";
    const emptyPattern = (x + y) % 5 === 0 ? '·' : (x * y) % 7 === 0 ? '.' : ' ';
    symbolElement = (
      <div className="text-gray-800 opacity-30">
        {emptyPattern}
      </div>
    );
  }

  return (
    <div ref={tileRef} className={tileClasses} style={tileStyle}>
      {symbolElement}
    </div>
  );
};

export default GameMap;
