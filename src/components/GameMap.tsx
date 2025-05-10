
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
    <div className="relative font-mono" style={{ 
      width: `${mapWidth}px`, 
      height: `${mapHeight}px`,
      margin: '0 auto',
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

  // Position and size
  const tileStyle = {
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
    left: `${x * TILE_SIZE}px`,
    top: `${y * TILE_SIZE}px`,
    transition: 'transform 0.2s ease-out, background-color 0.2s ease'
  };

  let tileClasses = "absolute flex items-center justify-center";
  let symbolElement = null;
  let symbolClasses = "math-symbol text-3xl";

  // Handle different tile types with retro ASCII art style
  if (isPlayer && player) {
    // Player
    tileClasses += " bg-black border-2 border-green-500";
    const pulseIntensity = Math.sin(timeElapsed * 0.01) * 0.2 + 0.8;
    symbolElement = (
      <div className={`${symbolClasses} text-green-400`}
           style={{ 
             textShadow: `0 0 5px rgba(0, 255, 0, ${pulseIntensity})`,
           }}>
        {player.symbol}
      </div>
    );
  } else if (symbol === SYMBOLS.WALL) {
    // Wall with ASCII texture
    tileClasses += " bg-black border border-blue-900";
    symbolElement = (
      <div className="text-blue-600 text-sm font-bold">
        {x % 2 === y % 2 ? '█' : '▓'}
      </div>
    );
  } else if ([SYMBOLS.ITEM_INTEGRATE, SYMBOLS.ITEM_DIFFERENTIATE, SYMBOLS.ITEM_MULTIPLY].includes(symbol)) {
    // Items with blinking effect
    const bobOffset = Math.sin(timeElapsed * 0.003 + x) * 4;
    const blinkIntensity = Math.sin(timeElapsed * 0.01 + x * 0.7) * 0.3 + 0.7;
    
    tileClasses += " bg-black border border-yellow-500";
    symbolElement = (
      <div 
        className={`${symbolClasses} text-yellow-500`}
        style={{ 
          transform: `translateY(${bobOffset}px)`,
          textShadow: `0 0 5px rgba(255, 255, 0, ${blinkIntensity})`,
        }}
      >
        {symbol}
      </div>
    );
  } else if ([SYMBOLS.ENEMY_ADD, SYMBOLS.ENEMY_SUBTRACT, SYMBOLS.ENEMY_MULTIPLY, SYMBOLS.ENEMY_DIVIDE].includes(symbol) && enemy) {
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
    }
    
    tileClasses += ` bg-black border-2 ${borderColor}`;
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
    // Empty space
    tileClasses += " bg-black";
    symbolElement = (
      <div className="text-gray-800 opacity-30">
        {x % 3 === 0 && y % 3 === 0 ? '·' : ' '}
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
