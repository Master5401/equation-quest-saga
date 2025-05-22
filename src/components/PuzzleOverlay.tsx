
import { useState, useEffect } from "react";
import { Level, Enemy } from "@/game/types";

interface PuzzleOverlayProps {
  level: Level;
  onSubmitAnswer: () => void;
  onAnswerChange: (answer: string) => void;
}

const PuzzleOverlay = ({ level, onSubmitAnswer, onAnswerChange }: PuzzleOverlayProps) => {
  const enemy = level.currentEnemy;
  const puzzleText = level.puzzleText;
  const userAnswer = level.userAnswer;
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30 second countdown
  
  // Add timer functionality
  useEffect(() => {
    if (!enemy) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitAnswer(); // Force submission on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [enemy, onSubmitAnswer]);
  
  if (!enemy) return null;

  // Determine enemy color class based on enemy type and difficulty
  let enemyColor = "text-red-500 border-red-500";
  let enemyName = "Arithmetic Entity";
  
  switch (enemy.symbol) {
    case "+": 
      enemyColor = "text-red-500 border-red-500"; 
      enemyName = "Addition Entity";
      break;
    case "-": 
      enemyColor = "text-red-800 border-red-800";
      enemyName = "Subtraction Entity"; 
      break;
    case "×": 
      enemyColor = "text-purple-500 border-purple-500";
      enemyName = "Multiplication Entity"; 
      break;
    case "÷": 
      enemyColor = "text-purple-800 border-purple-800";
      enemyName = "Division Entity"; 
      break;
    case "∫": 
      enemyColor = "text-blue-500 border-blue-500";
      enemyName = "Integration Entity"; 
      break;
    case "∂": 
      enemyColor = "text-blue-800 border-blue-800";
      enemyName = "Differentiation Entity"; 
      break;
  }

  // Handle keydown events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmitAnswer();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow digits, negative sign, decimal point, and fractions
    if (/^-?\d*\.?\d*$|^-?\d*\/?\d*$/.test(value)) {
      onAnswerChange(value);
    }
  };

  // Warning color for timer
  const timerColor = timeLeft > 10 ? "text-cyan-400" : 
                     timeLeft > 5 ? "text-yellow-400" : "text-red-500 animate-pulse";

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-90 flex items-center justify-center p-4 font-mono">
      <div className="bg-black border-2 border-cyan-500 p-6 w-full max-w-md text-center relative">
        {/* Terminal header */}
        <div className="border-b border-cyan-500 mb-6 pb-2 flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <div className="ml-2 opacity-70 text-cyan-400">enemy-{enemy.symbol}-encounter.exe</div>
          <div className={`ml-auto ${timerColor}`}>{timeLeft}s</div>
        </div>
        
        {/* Enemy identification */}
        <div className="text-sm text-cyan-300 mb-2 opacity-60">
          {enemyName} - Level {enemy.difficulty}
        </div>
        
        {/* ASCII art representation */}
        <pre className={`mb-6 ${enemyColor}`}>
{enemy.symbol === "+" ? `
   ▄▄▄▄▄
   █   █
 ▄▄█▄▄▄█▄▄
 █   █   █
 ███████████
   █   █
   █▄▄▄█
` : enemy.symbol === "-" ? `
   
   
 ▄▄▄▄▄▄▄▄▄
 █████████
 ▀▀▀▀▀▀▀▀▀
   
   
` : enemy.symbol === "×" ? `
 █     █
  █   █
   █ █
    █
   █ █
  █   █
 █     █
` : enemy.symbol === "÷" ? `
      █
      █
      █
 ▄▄▄▄▄█▄▄▄▄▄
      █
      █
      █
` : enemy.symbol === "∫" ? `
     ▄▄▄
    █   █
    █
    █
    █
    █   █
     ▀▀▀
` : `
   █████
  █     █
  █     █
  ██████
  █      
  █      
  █      
`}
        </pre>
        
        {/* Puzzle text with LaTeX-like formatting */}
        <div className="text-3xl font-mono text-cyan-400 mb-8 bg-black/30 p-4 border border-cyan-700">
          {puzzleText}
        </div>
        
        {/* Answer input */}
        <div className="relative mb-8">
          <div className="mb-2 text-xs text-cyan-400 opacity-70">ENTER ANSWER:</div>
          <input
            type="text"
            value={userAnswer}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="bg-black text-cyan-400 text-2xl font-mono py-3 px-4 w-full text-center border-2 border-cyan-500"
            autoFocus
            style={{caretColor: 'cyan'}}
          />
          <div className="text-xs text-cyan-600 mt-1">Integer, decimal or fraction (e.g. 3, 3.14, 2/3)</div>
        </div>
        
        {/* Submit button */}
        <button 
          onClick={onSubmitAnswer}
          className="bg-black border-2 border-cyan-500 hover:bg-cyan-900 text-cyan-400 px-8 py-2 transition-colors duration-200"
        >
          [ SOLVE ]
        </button>
        
        {/* Hint (conditionally displayed based on player skills) */}
        <div className="text-cyan-300 opacity-60 text-sm mt-4">
          Type answer and press Enter. ESC to quit.
        </div>
      </div>
    </div>
  );
};

export default PuzzleOverlay;
