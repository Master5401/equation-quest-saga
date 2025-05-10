
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
  
  if (!enemy) return null;

  // Determine enemy color class
  let enemyColor = "text-red-500 border-red-500";
  switch (enemy.symbol) {
    case "+": enemyColor = "text-red-500 border-red-500"; break;
    case "-": enemyColor = "text-red-800 border-red-800"; break;
    case "×": enemyColor = "text-purple-500 border-purple-500"; break;
    case "÷": enemyColor = "text-purple-800 border-purple-800"; break;
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
    // Only allow digits and a negative sign at the beginning
    if (/^-?\d*$/.test(value)) {
      onAnswerChange(value);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-90 flex items-center justify-center p-4 font-mono">
      <div className="bg-black border-2 border-cyan-500 p-6 w-full max-w-md text-center relative">
        {/* Terminal header */}
        <div className="border-b border-cyan-500 mb-6 pb-2 flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <div className="ml-2 opacity-70 text-cyan-400">enemy-encounter.exe</div>
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
` : `
      █
      █
      █
 ▄▄▄▄▄█▄▄▄▄▄
      █
      █
      █
`}
        </pre>
        
        {/* Puzzle text */}
        <div className="text-3xl font-mono text-cyan-400 mb-8">
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
        </div>
        
        {/* Submit button */}
        <button 
          onClick={onSubmitAnswer}
          className="bg-black border-2 border-cyan-500 hover:bg-cyan-900 text-cyan-400 px-8 py-2"
        >
          [ SOLVE ]
        </button>
        
        {/* Instructions */}
        <div className="text-cyan-300 opacity-60 text-sm mt-4">
          Type answer and press Enter. ESC to quit.
        </div>
      </div>
    </div>
  );
};

export default PuzzleOverlay;
