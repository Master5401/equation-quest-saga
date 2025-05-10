
import { useState, useEffect, useCallback } from "react";
import { GameState } from "@/game/constants";
import { GameData } from "@/game/types";
import { 
  startGame, 
  movePlayer, 
  updateGame, 
  checkPuzzleAnswer, 
  updatePuzzleAnswer,
  resetGame
} from "@/game/gameLogic";

import TitleScreen from "./TitleScreen";
import GameMap from "./GameMap";
import HUD from "./HUD";
import PuzzleOverlay from "./PuzzleOverlay";
import GameOver from "./GameOver";
import Victory from "./Victory";
import FlashEffect from "./FlashEffect";
import Message from "./Message";

const Game = () => {
  const [gameData, setGameData] = useState<GameData>(resetGame());
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Frame update logic
  useEffect(() => {
    const frameTimer = setInterval(() => {
      setGameData(prevData => updateGame(prevData));
      setTimeElapsed(prev => prev + 1);
    }, 1000 / 30); // 30 FPS
    
    return () => clearInterval(frameTimer);
  }, []);

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameData.state === GameState.TITLE_SCREEN) {
      setGameData(startGame());
      return;
    }
    
    if (gameData.state === GameState.PLAYING) {
      let dx = 0;
      let dy = 0;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          dy = -1; 
          break;
        case "ArrowDown":
        case "s":
        case "S":
          dy = 1; 
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          dx = -1; 
          break;
        case "ArrowRight":
        case "d":
        case "D":
          dx = 1; 
          break;
        case "Escape":
          window.location.reload(); 
          break;
        default: 
          break;
      }
      
      if (dx !== 0 || dy !== 0) {
        setGameData(prevData => movePlayer(prevData, dx, dy));
      }
    } else if (gameData.state === GameState.PUZZLE) {
      if (e.key === "Escape") {
        window.location.reload();
      }
      // Puzzle input handling is in PuzzleOverlay component
    } else if (gameData.state === GameState.GAME_OVER || gameData.state === GameState.VICTORY) {
      if (e.key === "Escape") {
        window.location.reload();
      } else {
        setGameData(resetGame());
      }
    }
  }, [gameData.state]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle puzzle answer submission
  const handleSubmitAnswer = useCallback(() => {
    setGameData(prevData => checkPuzzleAnswer(prevData));
  }, []);

  // Handle puzzle answer change
  const handleAnswerChange = useCallback((answer: string) => {
    setGameData(prevData => updatePuzzleAnswer(prevData, answer));
  }, []);

  // Restart game
  const handleRestart = useCallback(() => {
    setGameData(resetGame());
  }, []);

  // Start a new game
  const handleStartGame = useCallback(() => {
    setGameData(startGame());
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-black flex flex-col items-center font-mono">
      {gameData.state === GameState.TITLE_SCREEN && (
        <TitleScreen onStartGame={handleStartGame} />
      )}
      
      {(gameData.state === GameState.PLAYING || gameData.state === GameState.PUZZLE) && gameData.player && gameData.level && (
        <>
          <HUD player={gameData.player} currentLevel={gameData.currentLevel} />
          <div className="flex-1 overflow-auto w-full flex items-center justify-center">
            <GameMap 
              level={gameData.level} 
              player={gameData.player}
              timeElapsed={timeElapsed}
            />
          </div>
          
          {/* Retro style message */}
          {gameData.message && gameData.messageTimer > 0 && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black border border-green-500 px-4 py-2 text-green-400">
              {gameData.message}
            </div>
          )}
          
          {gameData.state === GameState.PUZZLE && (
            <PuzzleOverlay 
              level={gameData.level}
              onSubmitAnswer={handleSubmitAnswer}
              onAnswerChange={handleAnswerChange}
            />
          )}
        </>
      )}
      
      {gameData.state === GameState.GAME_OVER && gameData.player && (
        <GameOver player={gameData.player} onRestart={handleRestart} />
      )}
      
      {gameData.state === GameState.VICTORY && gameData.player && (
        <Victory player={gameData.player} onRestart={handleRestart} />
      )}
      
      <FlashEffect 
        color={gameData.flashColor} 
        duration={gameData.flashTimer}
      />
      
      {/* Controls Help */}
      {gameData.state === GameState.PLAYING && (
        <div className="fixed bottom-2 left-2 text-green-500 text-xs">
          CONTROLS: [↑ W] [← A] [↓ S] [→ D] | ESC: QUIT
        </div>
      )}
    </div>
  );
};

export default Game;
