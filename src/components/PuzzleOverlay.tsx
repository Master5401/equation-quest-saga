
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
  let enemyColorClass = "";
  switch (enemy.symbol) {
    case "+": enemyColorClass = "text-game-enemy-add"; break;
    case "-": enemyColorClass = "text-game-enemy-sub"; break;
    case "×": enemyColorClass = "text-game-enemy-mul"; break;
    case "÷": enemyColorClass = "text-game-enemy-div"; break;
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
    <div className="fixed inset-0 z-30 bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-blue-900 border-4 border-cyan-400 rounded-lg p-8 w-full max-w-md text-center relative">
        {/* Enemy symbol */}
        <div className="text-5xl font-bold mb-8 math-symbol animate-pulse">
          <span className={enemyColorClass}>{enemy.symbol}</span>
        </div>
        
        {/* Puzzle text */}
        <div className="text-3xl font-mono text-white mb-8">
          {puzzleText}
        </div>
        
        {/* Answer input */}
        <div className="relative mb-8">
          <input
            type="text"
            value={userAnswer}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="bg-gray-200 text-black text-2xl font-mono py-3 px-4 w-full rounded-md text-center"
            autoFocus
          />
        </div>
        
        {/* Instructions */}
        <div className="text-gray-300 text-sm">
          Type answer and press Enter. ESC to quit.
        </div>
      </div>
    </div>
  );
};

export default PuzzleOverlay;
