
import { Player } from "@/game/types";
import { MAX_LEVELS } from "@/game/constants";

interface HUDProps {
  player: Player;
  currentLevel: number;
}

const HUD = ({ player, currentLevel }: HUDProps) => {
  return (
    <div className="w-full h-[50px] bg-game-hud border-b-2 border-cyan-400 flex items-center px-4 text-white">
      {/* Health */}
      <div className="flex items-center space-x-2">
        <span className="font-mono text-lg">HP: {player.health}</span>
        <div className="w-36 h-5 bg-red-900 relative">
          <div 
            className="h-full bg-red-600 absolute left-0 top-0 transition-all duration-300" 
            style={{ width: `${Math.max(0, player.health)}%` }}
          ></div>
          <div className="absolute inset-0 border border-white"></div>
        </div>
      </div>
      
      {/* Score */}
      <div className="ml-6 font-mono text-lg">
        Score: {player.score}
      </div>
      
      {/* Level */}
      <div className="ml-6 font-mono text-lg">
        Level: {currentLevel}/{MAX_LEVELS}
      </div>
      
      {/* Inventory */}
      <div className="ml-6 font-mono text-lg overflow-hidden whitespace-nowrap">
        Items: {player.inventory.length > 0 
          ? player.inventory.join(", ") 
          : "None"}
      </div>
      
      {/* Exit Button */}
      <div className="ml-auto">
        <button 
          className="bg-red-900 hover:bg-red-800 px-4 py-1 rounded text-white"
          onClick={() => window.location.reload()}
        >
          EXIT
        </button>
      </div>
    </div>
  );
};

export default HUD;
