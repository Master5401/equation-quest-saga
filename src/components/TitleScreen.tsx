
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
      "text-green-500", "text-green-400", "text-cyan-500", "text-cyan-400", 
      "text-blue-500", "text-blue-400", "text-yellow-500", "text-yellow-400"
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
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-mono" 
      onClick={handleClick}
      tabIndex={0}
    >
      {/* Retro Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(transparent_0%,_rgba(0,_255,_0,_0.05)_10%,_rgba(0,_255,_0,_0.05)_90%,_transparent_100%)] bg-[length:20px_20px]"></div>
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,_transparent_0%,_rgba(0,_255,_0,_0.05)_10%,_rgba(0,_255,_0,_0.05)_90%,_transparent_100%)] bg-[length:20px_20px]"></div>
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
            opacity: symbol.opacity,
            textShadow: '0 0 5px currentColor'
          }}
        >
          {symbol.char}
        </div>
      ))}
      
      {/* ASCII Art Title */}
      <pre className="text-green-500 text-sm md:text-base mb-4 leading-tight">
{`
 ▄▄▄▄▄▄▄ ▄    ▄ ▄▄▄▄▄▄▄               
 █       █    █ █       █       ▀▀█    
 █▄▄▄▄▄  █    █ █    ▄▄▄█        █    
       █ █    █ █   █▄▄▄  ▄▄▄    █    
 █▄▄▄▄▄█ █▄▄▄▄█ █    ▄▄▄█       █     
                                █      
 ▄    ▄ ▄▄▄▄▄▄  ▄▄▄▄▄▄   ▄▄▄▄▄▄█ ▄▄▄▄▄▄  ▄▄▄▄▄▄  ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ 
 █    █ █      █      █ █       █      ██      ██       █       █       █
 █    █ █      █      █ █       █▄▄▄▄   █      ██▄▄▄▄▄  █    ▄▄▄█    ▄▄▄█
 █    █ █      █      █ █           █▄▄ █      ██▄▄▄▄▄█ █   █▄▄▄█   █▄▄▄ 
 █▄▄▄▄█ █▄▄▄▄▄▄█▄▄▄▄▄▄█ █▄▄▄▄▄▄▄ ▄▄▄▄▄█ █▄▄▄▄▄██      ▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█
`}
      </pre>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-green-400 relative z-10 px-4 text-center"
          style={{ 
            textShadow: '0 0 10px #00FF00, 0 0 20px rgba(0, 255, 0, 0.5)',
          }}>
        The Variables of Destiny
      </h1>
      
      {/* Story Box with retro terminal appearance */}
      <div className="w-5/6 md:w-3/4 lg:w-2/3 mb-6 relative">
        <div className="relative bg-black border-2 border-green-500 p-4 md:p-6 font-mono text-green-400 rounded">
          <div className="border-b border-green-500 mb-4 pb-2 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="ml-2 opacity-70">terminal@numerica:~$</div>
          </div>
          <div className="text-sm md:text-base space-y-3 leading-relaxed" style={{textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'}}>
            <p>You were just a 21-year-old student, struggling to finish a late-night math assignment.</p>
            <p>The final problem was strange — something about dividing by zero. You hesitated... then did it anyway.</p>
            <p>Suddenly, reality fractured. Your screen flickered. Symbols bled from your notebook. The walls twisted into graphs and spirals. And then — silence.</p>
            <p>You awaken in a void of white noise and ASCII code. You're no longer in your room. You're in Numerica, a decaying realm of pure mathematics.</p>
            <p>A whisper greets you: <span className="text-cyan-400">"You've divided by zero. The balance is broken. Now you must fix what you've torn."</span></p>
            <p>You are π, the last hope. Solve the corrupted logic. Restore the Grand Equation. Or be lost in the infinite recursion of your own mistake.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xl text-green-500 animate-pulse">
        Press any key to begin
      </div>
      
      {/* Retro ASCII Footer */}
      <div className="absolute bottom-4 text-green-600 text-xs opacity-60">
        <pre>{`
+===========================================+
|    (c)2025 LOVABLE INTERACTIVE SYSTEMS    |
|             ALL RIGHTS RESERVED           |
+===========================================+
        `}</pre>
      </div>
    </div>
  );
};

export default TitleScreen;
