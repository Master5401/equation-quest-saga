
import { useState, useEffect } from "react";
import { TITLE_SYMBOLS, SCREEN_WIDTH, SCREEN_HEIGHT } from "@/game/constants";
import { TitleSymbol } from "@/game/types";

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen = ({ onStartGame }: TitleScreenProps) => {
  const [symbols, setSymbols] = useState<TitleSymbol[]>([]);
  const [showStory, setShowStory] = useState(false);

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

  const handleStartGame = () => {
    onStartGame();
  };

  const toggleStory = () => {
    setShowStory(!showStory);
  };

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden"
      onClick={showStory ? undefined : handleStartGame}
      onKeyDown={showStory ? undefined : handleStartGame}
      tabIndex={0}
    >
      {/* 3D-like background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-black/80 z-0"></div>
      <div className="absolute w-full h-full">
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2WiIgc3Ryb2tlPSIjMDMwMzA2IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-10"></div>
      </div>

      {/* Grid lines for 3D effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[linear-gradient(transparent_0%,_rgba(45,_10,_70,_0.2)_40%,_rgba(45,_10,_70,_0.2)_60%,_transparent_100%)] bg-[length:40px_40px] bg-[0_0,_20px_20px] animate-[pulse_4s_ease-in-out_infinite]"></div>
      </div>

      {/* Animated symbols with 3D effect */}
      {symbols.map((symbol, index) => (
        <div 
          key={index}
          className="absolute math-symbol text-2xl md:text-4xl"
          style={{
            left: `${symbol.x}px`,
            top: `${symbol.y}px`,
            color: symbol.color,
            textShadow: `0 0 10px ${symbol.color}, 0 0 20px ${symbol.color}`,
            transform: `translateZ(${Math.random() * 50}px) scale(${0.8 + Math.random() * 0.4})`,
            transition: 'transform 0.3s ease'
          }}
        >
          {symbol.char}
        </div>
      ))}
      
      {/* Title with 3D effect */}
      <div className="z-10 text-center px-4 relative">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-cyan-400"
            style={{ 
              textShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, 0 5px 5px rgba(0,0,0,0.5)"
            }}
        >
          The Variables of Destiny
        </h1>
        <h2 className="text-xl md:text-3xl font-bold mb-8 text-yellow-300"
            style={{
              textShadow: "0 0 10px #FFFF00, 0 0 15px #FFFF00, 0 3px 3px rgba(0,0,0,0.5)"
            }}
        >
          A Mathematical Adventure
        </h2>
        
        {!showStory ? (
          <div className="space-y-4 mb-8">
            <button 
              onClick={toggleStory} 
              className="py-2 px-6 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transform transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,150,255,0.5)]"
              style={{ textShadow: "0 0 5px rgba(255,255,255,0.7)" }}
            >
              Read the Story
            </button>
            
            <div className="animate-pulse mt-8">
              <p className="text-gray-300">Press any key to begin your quest</p>
            </div>
          </div>
        ) : (
          <div className="bg-black/80 p-6 rounded-lg border border-cyan-800 shadow-[0_0_30px_rgba(0,150,255,0.3)]" 
               style={{ maxWidth: "600px" }}>
            <h3 className="text-xl text-cyan-300 mb-4">The Legend of the Lost Equation</h3>
            
            <p className="mb-3 text-gray-200">
              In the realm of Numerica, mathematics once flowed in perfect harmony, governed by the Grand Equation that balanced all formulas and theorems across the universe.
            </p>
            
            <p className="mb-3 text-gray-200">
              Then came the great Fracture - a catastrophic event that shattered the Grand Equation into fragments, sending mathematical chaos throughout the land. Variables turned wild, functions became unpredictable, and logic itself began to unravel.
            </p>
            
            <p className="mb-3 text-gray-200">
              As π, the chosen variable, you must journey through the corrupted domains of Numerica, collecting powerful mathematical artifacts and defeating the rogue operations that now plague the land.
            </p>
            
            <p className="mb-3 text-gray-200">
              Only by solving the mathematical puzzles that bind these chaotic elements can you restore balance and reconstruct the Grand Equation before all of Numerica collapses into irrational disorder.
            </p>
            
            <button 
              onClick={toggleStory} 
              className="mt-4 py-2 px-6 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transform transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,150,255,0.5)]"
              style={{ textShadow: "0 0 5px rgba(255,255,255,0.7)" }}
            >
              Back
            </button>
            
            <button 
              onClick={handleStartGame} 
              className="mt-4 ml-4 py-2 px-6 bg-green-700 hover:bg-green-600 text-white rounded-lg transform transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,255,150,0.5)]"
              style={{ textShadow: "0 0 5px rgba(255,255,255,0.7)" }}
            >
              Begin Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleScreen;
