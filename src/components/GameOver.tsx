
import { Player } from "@/game/types";

interface GameOverProps {
  player: Player;
  onRestart: () => void;
}

const GameOver = ({ player, onRestart }: GameOverProps) => {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-black"
      onClick={onRestart}
      tabIndex={0}
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-12 text-red-500">GAME OVER</h1>
      
      <p className="text-2xl md:text-3xl mb-8 text-white">Final Score: {player.score}</p>
      
      <p className="text-gray-400 mt-8 animate-pulse">
        Press any key to restart, or ESC to quit.
      </p>
    </div>
  );
};

export default GameOver;
