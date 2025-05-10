
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
      margin: '0 auto'
    }}>
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
    top: `${y * TILE_SIZE}px`
  };

  let tileClasses = "absolute flex items-center justify-center border border-game-tile-border bg-game-tile";
  let symbolElement = null;
  let symbolClasses = "math-symbol text-3xl";

  // Handle different tile types
  if (isPlayer && player) {
    // Player
    tileClasses += " bg-game-player-bg border-game-player";
    symbolElement = <div className={`${symbolClasses} text-game-player`}>{player.symbol}</div>;
  } else if (symbol === SYMBOLS.WALL) {
    // Wall
    tileClasses += " bg-game-wall-side border-game-wall-side relative";
    symbolElement = (
      <div className="relative h-full w-full">
        <div className="absolute inset-1 bg-game-wall-face flex items-center justify-center">
          <span className={`${symbolClasses} text-white`}>{symbol}</span>
        </div>
      </div>
    );
  } else if ([SYMBOLS.ITEM_INTEGRATE, SYMBOLS.ITEM_DIFFERENTIATE, SYMBOLS.ITEM_MULTIPLY].includes(symbol)) {
    // Items
    const bobOffset = Math.sin(timeElapsed * 0.003 + x) * 4;
    symbolElement = (
      <div 
        className={`${symbolClasses} text-game-item animate-pulse relative`}
        style={{ transform: `translateY(${bobOffset}px)` }}
      >
        {/* Simple glow effect with shadow */}
        <div className="absolute inset-0 blur-sm text-yellow-500 opacity-75" 
             style={{ filter: 'brightness(0.6)' }}>
          {symbol}
        </div>
        {symbol}
      </div>
    );
  } else if ([SYMBOLS.ENEMY_ADD, SYMBOLS.ENEMY_SUBTRACT, SYMBOLS.ENEMY_MULTIPLY, SYMBOLS.ENEMY_DIVIDE].includes(symbol) && enemy) {
    // Enemies
    const pulseOpacity = Math.abs(Math.sin(timeElapsed * 0.002)) * 0.4 + 0.4; // 0.4 to 0.8
    
    let baseColor = "bg-game-enemy-add";
    let textColor = "text-game-enemy-add";
    
    if (symbol === SYMBOLS.ENEMY_SUBTRACT) {
      baseColor = "bg-game-enemy-sub";
      textColor = "text-game-enemy-sub";
    } else if (symbol === SYMBOLS.ENEMY_MULTIPLY) {
      baseColor = "bg-game-enemy-mul";
      textColor = "text-game-enemy-mul";
    } else if (symbol === SYMBOLS.ENEMY_DIVIDE) {
      baseColor = "bg-game-enemy-div";
      textColor = "text-game-enemy-div";
    }
    
    tileClasses += ` ${baseColor} opacity-${Math.round(pulseOpacity * 100)}`;
    symbolElement = <div className={`${symbolClasses} ${textColor}`}>{symbol}</div>;
  }

  return (
    <div ref={tileRef} className={tileClasses} style={tileStyle}>
      {symbolElement}
    </div>
  );
};

export default GameMap;
