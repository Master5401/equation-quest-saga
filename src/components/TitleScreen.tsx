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
    
    for (let i = 0; i < 40; i++) {
      newSymbols.push({
        char: TITLE_SYMBOLS[Math.floor(Math.random() * TITLE_SYMBOLS.length)],
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT,
        dx: (Math.random() - 0.5) * 1.6,
        dy: (Math.random() - 0.5) * 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        z: Math.random() * 100 // Z-depth for 3D effect
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
          let newZ = symbol.z + (Math.random() - 0.5) * 0.5; // Subtle Z movement
          
          // Keep Z within bounds
          newZ = Math.max(0, Math.min(newZ, 100));
          
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
            dy: newDy,
            z: newZ
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
      {/* 3D depth grid background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-black/80 z-0"></div>
      <div className="absolute w-full h-full perspective-[1000px]">
        <div 
          className="absolute w-full h-full"
          style={{ 
            backgroundImage: `
              linear-gradient(rgba(30,30,60,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(30,30,60,0.05) 1px, transparent 1px),
              linear-gradient(rgba(60,60,90,0.1) 2px, transparent 2px),
              linear-gradient(90deg, rgba(60,60,90,0.1) 2px, transparent 2px)
            `,
            backgroundSize: `10px 10px, 10px 10px, 50px 50px, 50px 50px`,
            transform: 'rotateX(75deg) translateZ(-100px) translateY(-30%) scale(2.5)',
            opacity: 0.4
          }}
        ></div>
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
            transform: `translateZ(${symbol.z}px) scale(${1 - symbol.z/200})`,
            opacity: 1 - symbol.z/150, // Fade with depth
            zIndex: Math.round(100 - symbol.z),
            transition: 'transform 0.3s ease, opacity 0.3s ease'
          }}
        >
          {symbol.char}
        </div>
      ))}
      
      {/* Title with 3D effect */}
      <div className="z-10 text-center px-4 relative">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-cyan-400"
            style={{ 
              textShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, 0 5px 5px rgba(0,0,0,0.5)",
              transform: "perspective(500px) rotateX(10deg)"
            }}
        >
          The Variables of Destiny
        </h1>
        <h2 className="text-xl md:text-3xl font-bold mb-8 text-yellow-300"
            style={{
              textShadow: "0 0 10px #FFFF00, 0 0 15px #FFFF00, 0 3px 3px rgba(0,0,0,0.5)",
              transform: "perspective(500px) rotateX(5deg)"
            }}
        >
          A Mathematical Adventure
        </h2>
        
        {!showStory ? (
          <div className="space-y-4 mb-8">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleStory(); }} 
              className="py-2 px-6 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transform transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,150,255,0.5)]"
              style={{ 
                textShadow: "0 0 5px rgba(255,255,255,0.7)",
                transform: "perspective(500px) rotateX(5deg)" 
              }}
            >
              Read the Story
            </button>
            
            <div className="animate-pulse mt-8">
              <p className="text-gray-300">Press any key to begin your quest</p>
            </div>
          </div>
        ) : (
          <div 
            className="bg-black/80 p-6 rounded-lg border border-cyan-800 shadow-[0_0_30px_rgba(0,150,255,0.3)]" 
            style={{ 
              maxWidth: "700px",
              transform: "perspective(1000px) rotateX(2deg)",
              transformStyle: "preserve-3d"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl text-cyan-300 mb-4">The Zero Equation</h3>
            
            <div className="story-text space-y-3 text-left text-gray-200 leading-relaxed">
              <p>
                You were just a 21-year-old student, struggling to finish a late-night math assignment.
              </p>
              
              <p>
                The final problem was strange — something about dividing by zero. You hesitated... then did it anyway.
              </p>
              
              <p className="font-bold text-pink-300">
                Suddenly, reality fractured.<br/>
                Your screen flickered.<br/>
                Symbols bled from your notebook.<br/>
                The walls twisted into graphs and spirals.<br/>
                And then — silence.
              </p>
              
              <p>
                You awaken in a void of white noise and ASCII code.
                You're no longer in your room. You're in Numerica, a decaying realm of pure mathematics.
              </p>
              
              <p className="italic text-cyan-200">
                A whisper greets you:
              </p>
              
              <p className="italic text-yellow-200 text-center">
                "You've divided by zero.<br/>
                The balance is broken.<br/>
                Now you must fix what you've torn."
              </p>
              
              <p className="font-bold text-center">
                You are π, the last hope.<br/>
                Solve the corrupted logic. Restore the Grand Equation.<br/>
                Or be lost in the infinite recursion of your own mistake.
              </p>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button 
                onClick={toggleStory} 
                className="py-2 px-6 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transform transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,150,255,0.5)]"
                style={{ textShadow: "0 0 5px rgba(255,255,255,0.7)" }}
              >
                Back
              </button>
              
              <button 
                onClick={handleStartGame} 
                className="py-2 px-6 bg-green-700 hover:bg-green-600 text-white rounded-lg transform transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,255,150,0.5)]"
                style={{ textShadow: "0 0 5px rgba(255,255,255,0.7)" }}
              >
                Begin Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleScreen;
