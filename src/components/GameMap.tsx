
import { useEffect, useRef } from "react";
import { Level, Player, Position } from "@/game/types";
import { SYMBOLS, TILE_SIZE } from "@/game/constants";
import { posToKey } from "@/game/levelGenerator";

interface GameMapProps {
  level: Level;
  player: Player;
  timeElapsed: number;
}

const GameMap = ({ level, player, timeElapsed }: GameMapProps) => {
  const mapWidth = level.map[0].length * TILE_SIZE;
  const mapHeight = level.map.length * TILE_SIZE;
  
  // Calculate centering offset
  const offsetX = Math.max(0, (800 - mapWidth) / 2);
  const offsetY = Math.max(50, (600 - mapHeight) / 2);

  return (
    <div className="relative" style={{ 
      width: `${mapWidth}px`, 
      height: `${mapHeight}px`,
      margin: '0 auto',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
      transform: 'rotateX(5deg)'
    }}>
      {/* Background grid for 3D effect */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(rgba(30,30,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,30,0.3) 1px, transparent 1px)',
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        transform: 'translateZ(-10px)',
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
            />
          );
        })
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
}

const MapTile = ({ symbol, x, y, isPlayer, player, enemy, timeElapsed }: MapTileProps) => {
  const tileRef = useRef<HTMLDivElement>(null);

  // Position and size with 3D effect
  const tileStyle = {
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
    left: `${x * TILE_SIZE}px`,
    top: `${y * TILE_SIZE}px`,
    transform: `translateZ(${isPlayer ? 15 : 0}px)`,
    transition: 'transform 0.2s ease-out'
  };

  let tileClasses = "absolute flex items-center justify-center border border-game-tile-border bg-game-tile";
  let symbolElement = null;
  let symbolClasses = "math-symbol text-3xl";

  // Handle different tile types with enhanced 3D
  if (isPlayer && player) {
    // Player with 3D effect
    tileClasses += " bg-game-player-bg border-game-player relative shadow-lg";
    symbolElement = (
      <div className={`${symbolClasses} text-game-player`}
           style={{ 
             filter: 'drop-shadow(0 0 5px rgba(0, 255, 0, 0.7))',
             textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
           }}>
        {player.symbol}
        <div className="absolute inset-0 blur-sm opacity-60"
             style={{ filter: 'brightness(1.5)' }}>
          {player.symbol}
        </div>
      </div>
    );
  } else if (symbol === SYMBOLS.WALL) {
    // Wall with 3D effect
    tileClasses += " bg-game-wall-side border-none relative overflow-hidden";
    symbolElement = (
      <div className="relative h-full w-full transform-gpu" 
           style={{ transformStyle: 'preserve-3d' }}>
        {/* Top face */}
        <div className="absolute top-0 left-0 w-full h-1/4 bg-cyan-700 origin-bottom transform skew-x-45 -translate-y-1/2"></div>
        
        {/* Left face */}
        <div className="absolute top-0 left-0 w-1/4 h-full bg-cyan-900 origin-right transform skew-y-45 -translate-x-1/2"></div>
        
        {/* Front face */}
        <div className="absolute inset-[2px] bg-game-wall-face flex items-center justify-center"
             style={{ boxShadow: 'inset 0 0 15px rgba(0, 255, 255, 0.3)' }}>
          <span className={`${symbolClasses} text-white`}
                style={{ textShadow: '0 0 5px rgba(255, 255, 255, 0.7)' }}>
            {symbol}
          </span>
        </div>
      </div>
    );
  } else if ([SYMBOLS.ITEM_INTEGRATE, SYMBOLS.ITEM_DIFFERENTIATE, SYMBOLS.ITEM_MULTIPLY].includes(symbol)) {
    // Items with enhanced 3D and glow effects
    const bobOffset = Math.sin(timeElapsed * 0.003 + x) * 4;
    const rotateY = Math.sin(timeElapsed * 0.002) * 15;
    
    symbolElement = (
      <div 
        className={`${symbolClasses} text-game-item relative`}
        style={{ 
          transform: `translateY(${bobOffset}px) rotateY(${rotateY}deg)`,
          textShadow: '0 0 10px rgba(255, 255, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.5)',
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 blur-md text-yellow-500 opacity-75"
             style={{ filter: 'brightness(1.5)', transform: 'scale(1.2)' }}>
          {symbol}
        </div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 blur-sm text-white opacity-50">
          {symbol}
        </div>
        
        {/* Main symbol */}
        {symbol}
        
        {/* Light reflection */}
        <div className="absolute top-0 left-1/2 w-1 h-full bg-white opacity-70 transform -translate-x-1/2"
             style={{ 
               clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0% 100%)',
               animation: 'pulse 2s infinite'
             }}>
        </div>
      </div>
    );
  } else if ([SYMBOLS.ENEMY_ADD, SYMBOLS.ENEMY_SUBTRACT, SYMBOLS.ENEMY_MULTIPLY, SYMBOLS.ENEMY_DIVIDE].includes(symbol) && enemy) {
    // Enemies with 3D and pulsing effects
    const pulseOpacity = Math.abs(Math.sin(timeElapsed * 0.002)) * 0.4 + 0.4; // 0.4 to 0.8
    const floatY = Math.sin(timeElapsed * 0.003 + x * 0.7) * 3;
    
    let baseColor = "bg-game-enemy-add";
    let textColor = "text-game-enemy-add";
    let glowColor = "rgba(255, 0, 0, 0.7)";
    
    if (symbol === SYMBOLS.ENEMY_SUBTRACT) {
      baseColor = "bg-game-enemy-sub";
      textColor = "text-game-enemy-sub";
      glowColor = "rgba(128, 0, 0, 0.7)";
    } else if (symbol === SYMBOLS.ENEMY_MULTIPLY) {
      baseColor = "bg-game-enemy-mul";
      textColor = "text-game-enemy-mul";
      glowColor = "rgba(255, 0, 255, 0.7)";
    } else if (symbol === SYMBOLS.ENEMY_DIVIDE) {
      baseColor = "bg-game-enemy-div";
      textColor = "text-game-enemy-div";
      glowColor = "rgba(128, 0, 128, 0.7)";
    }
    
    tileClasses += ` ${baseColor} opacity-${Math.round(pulseOpacity * 100)} shadow-lg`;
    symbolElement = (
      <div className={`${symbolClasses} ${textColor} relative`}
           style={{ 
             transform: `translateY(${floatY}px)`,
             textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`
           }}>
        {/* Glow effect */}
        <div className="absolute inset-0 blur-md opacity-70">
          {symbol}
        </div>
        
        {/* Main symbol */}
        {symbol}
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
