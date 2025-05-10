
import { useState, useEffect } from "react";
import { TITLE_SYMBOLS, SCREEN_WIDTH, SCREEN_HEIGHT } from "@/game/constants";
import { TitleSymbol } from "@/game/types";

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen = ({ onStartGame }: TitleScreenProps) => {
  const [symbols, setSymbols] = useState<TitleSymbol[]>([]);

  // Generate random title symbols
  useEffect(() => {
    const newSymbols: TitleSymbol[] = [];
    const colors = [
      "#00FF00", // Bright Green
      "#FF0000", // Bright Red
      "#0000FF", // Bright Blue
      "#00FFFF", // Bright Cyan
      "#FF00FF", // Bright Magenta
      "#FFFF00", // Bright Yellow
      "#006400", // Dark Green
      "#800000", // Dark Red
      "#000080", // Dark Blue
      "#808080", // Gray
      "#C0C0C0"  // Light Gray
    ];
    
    for (let i = 0; i < 30; i++) {
      newSymbols.push({
        char: TITLE_SYMBOLS[Math.floor(Math.random() * TITLE_SYMBOLS.length)],
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT,
        dx: (Math.random() - 0.5) * 1.6,
        dy: (Math.random() - 0.5) * 1.6,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setSymbols(newSymbols);
  }, []);

  // Animate symbols
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setSymbols(prevSymbols => 
        prevSymbols.map(symbol => {
          let newX = symbol.x + symbol.dx;
          let newY = symbol.y + symbol.dy;
          let newDx = symbol.dx;
          let newDy = symbol.dy;
          
          // Bounce off edges
          if (newX < 0 || newX > SCREEN_WIDTH) {
            newDx = -newDx;
            newX = Math.max(0, Math.min(newX, SCREEN_WIDTH));
          }
          
          if (newY < 0 || newY > SCREEN_HEIGHT) {
            newDy = -newDy;
            newY = Math.max(0, Math.min(newY, SCREEN_HEIGHT));
          }
          
          return {
            ...symbol,
            x: newX,
            y: newY,
            dx: newDx,
            dy: newDy
          };
        })
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [symbols]);

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden"
      onClick={onStartGame}
      onKeyDown={onStartGame}
      tabIndex={0}
    >
      {/* Animated symbols */}
      {symbols.map((symbol, index) => (
        <div 
          key={index}
          className="absolute math-symbol text-2xl md:text-4xl"
          style={{
            left: `${symbol.x}px`,
            top: `${symbol.y}px`,
            color: symbol.color,
            transition: 'transform 0.3s ease',
            transform: `scale(${0.8 + Math.random() * 0.4})`
          }}
        >
          {symbol.char}
        </div>
      ))}
      
      {/* Title */}
      <div className="z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-cyan-400">
          The Variables of Destiny
        </h1>
        <h2 className="text-xl md:text-3xl font-bold mb-12 text-yellow-300">
          A Mathematical Adventure
        </h2>
        
        <div className="space-y-2 mb-8 text-white">
          <p>Navigate the realms of logic,</p>
          <p>Solve equations to vanquish foes,</p>
          <p>Collect powerful theorems,</p>
          <p>And restore the Grand Equation!</p>
        </div>
        
        <div className="animate-pulse mt-8">
          <p className="text-gray-300">Press any key to begin your quest</p>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
