
import { Player } from "@/game/types";

interface VictoryProps {
  player: Player;
  onRestart: () => void;
}

const Victory = ({ player, onRestart }: VictoryProps) => {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-blue-900"
      onClick={onRestart}
      tabIndex={0}
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-8 text-green-400">VICTORY!</h1>
      
      <p className="text-2xl md:text-3xl mb-10 text-yellow-300">
        You have restored the Grand Equation!
      </p>
      
      <p className="text-2xl md:text-3xl mb-12 text-white">
        Final Score: {player.score}
      </p>
      
      <p className="text-gray-300 mt-8 animate-pulse">
        Press any key to play again, or ESC to quit.
      </p>
    </div>
  );
};

export default Victory;
