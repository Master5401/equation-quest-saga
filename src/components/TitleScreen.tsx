import React, { useState, useEffect, useCallback } from 'react';

interface TitleSymbol {
  char: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
  rotation: number;
  opacity: number;
}

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const [symbols, setSymbols] = useState<TitleSymbol[]>([]);
  
  // Initialize symbols
  useEffect(() => {
    const symbolChars = ["∑", "∏", "∆", "√", "∞", "∫", "≠", "≤", "≥", "±", "÷", "×", "ƒ", "∂", "∇"];
    const colors = [
      "text-red-500", "text-green-500", "text-blue-500", "text-cyan-500", 
      "text-purple-500", "text-yellow-500", "text-pink-500"
    ];
    
    const newSymbols: TitleSymbol[] = [];
    for (let i = 0; i < 40; i++) {
      newSymbols.push({
        char: symbolChars[Math.floor(Math.random() * symbolChars.length)],
        x: Math.random() * 100, // percentage
        y: Math.random() * 100,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 20) + 20,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
    setSymbols(newSymbols);
  }, []);
  
  // Animation frame
  const updateSymbols = useCallback(() => {
    setSymbols(prevSymbols => {
      return prevSymbols.map(symbol => {
        // Update position
        let x = symbol.x + symbol.dx;
        let y = symbol.y + symbol.dy;
        let dx = symbol.dx;
        let dy = symbol.dy;
        
        // Bounce off edges
        if (x < 0 || x > 100) dx *= -1;
        if (y < 0 || y > 100) dy *= -1;
        
        // Small random variations for organic feel
        dx += (Math.random() - 0.5) * 0.05;
        dy += (Math.random() - 0.5) * 0.05;
        
        // Keep speed in check
        const maxSpeed = 0.5;
        dx = Math.max(Math.min(dx, maxSpeed), -maxSpeed);
        dy = Math.max(Math.min(dy, maxSpeed), -maxSpeed);
        
        return {
          ...symbol,
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
          dx,
          dy,
          rotation: (symbol.rotation + Math.random() * 2 - 1) % 360
        };
      });
    });
  }, []);
  
  useEffect(() => {
    const intervalId = setInterval(updateSymbols, 50);
    return () => clearInterval(intervalId);
  }, [updateSymbols]);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    onStartGame();
  }, [onStartGame]);
  
  const handleClick = () => {
    onStartGame();
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden" 
      onClick={handleClick}
      tabIndex={0}
    >
      {/* 3D Grid Effect */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(transparent_0%,_rgba(255,_0,_255,_0.1)_10%,_rgba(255,_0,_255,_0.1)_90%,_transparent_100%)] bg-[length:50px_50px]"
             style={{
               transform: "perspective(1000px) rotateX(60deg) translateZ(-100px) scale(2)",
               transformOrigin: "center center"
             }}></div>
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,_transparent_0%,_rgba(255,_0,_255,_0.1)_10%,_rgba(255,_0,_255,_0.1)_90%,_transparent_100%)] bg-[length:50px_50px]"
             style={{
               transform: "perspective(1000px) rotateX(60deg) translateZ(-100px) scale(2)",
               transformOrigin: "center center"
             }}></div>
      </div>
      
      {/* Floating Symbols */}
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className={`absolute select-none pointer-events-none ${symbol.color}`}
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            transform: `rotateX(${symbol.rotation}deg) rotateY(${symbol.rotation * 0.7}deg) translateZ(0px)`,
            opacity: symbol.opacity,
            textShadow: '0 0 10px currentColor'
          }}
        >
          {symbol.char}
        </div>
      ))}
      
      <h1 className="text-4xl md:text-7xl font-bold mb-8 text-cyan-400 relative z-10"
          style={{ 
            textShadow: '0 0 20px #0ff, 0 0 40px rgba(0, 255, 255, 0.5)',
            transform: 'perspective(500px) rotateX(10deg)'
          }}>
        The Variables of Destiny
      </h1>
      
      {/* Story Box */}
      <div className="w-5/6 md:w-3/4 lg:w-2/3 mb-6 relative">
        <div className="absolute inset-0 blur-xl bg-purple-900/30 rounded-xl transform scale-110"></div>
        <div className="relative bg-black/70 backdrop-blur-sm border border-purple-700 p-6 rounded-lg shadow-lg"
             style={{ transform: 'perspective(1000px) rotateX(5deg)' }}>
          <div className="text-sm md:text-base text-white space-y-3">
            <p>You were just a 21-year-old student, struggling to finish a late-night math assignment.</p>
            <p>The final problem was strange — something about dividing by zero. You hesitated... then did it anyway.</p>
            <p>Suddenly, reality fractured. Your screen flickered. Symbols bled from your notebook. The walls twisted into graphs and spirals. And then — silence.</p>
            <p>You awaken in a void of white noise and ASCII code. You're no longer in your room. You're in Numerica, a decaying realm of pure mathematics.</p>
            <p>A whisper greets you: <span className="text-cyan-400">"You've divided by zero. The balance is broken. Now you must fix what you've torn."</span></p>
            <p>You are π, the last hope. Solve the corrupted logic. Restore the Grand Equation. Or be lost in the infinite recursion of your own mistake.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xl text-white animate-pulse">
        Press any key to begin
      </div>
    </div>
  );
};

export default TitleScreen;
