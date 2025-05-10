
import { Player } from "@/game/types";
import { MAX_LEVELS } from "@/game/constants";

interface HUDProps {
  player: Player;
  currentLevel: number;
}

const HUD = ({ player, currentLevel }: HUDProps) => {
  return (
    <div className="w-full h-[50px] bg-black border-b-2 border-green-500 flex items-center px-4 text-green-400 font-mono">
      {/* Health */}
      <div className="flex items-center space-x-2">
        <span className="text-lg">HP:</span>
        <div className="w-36 h-5 bg-black border border-green-600 relative">
          <div 
            className="h-full bg-green-600 absolute left-0 top-0 transition-all duration-300" 
            style={{ width: `${Math.max(0, player.health)}%` }}
          ></div>
          <div className="absolute left-0 top-0 h-full w-full flex items-center justify-center text-xs">
            {player.health}/100
          </div>
        </div>
      </div>
      
      {/* Score */}
      <div className="ml-6 text-lg">
        <span className="opacity-70">SCORE:</span> {player.score}
      </div>
      
      {/* Level */}
      <div className="ml-6 text-lg">
        <span className="opacity-70">LVL:</span> {currentLevel}/{MAX_LEVELS}
      </div>
      
      {/* Inventory ASCII representation */}
      <div className="ml-6 text-lg overflow-hidden whitespace-nowrap">
        <span className="opacity-70">ITEMS:</span> 
        {player.inventory.length > 0 
          ? player.inventory.join(" ") 
          : "[ ]"}
      </div>
      
      {/* Exit Button */}
      <div className="ml-auto">
        <button 
          className="bg-black border border-red-500 hover:bg-red-900 px-4 py-1 text-red-500"
          onClick={() => window.location.reload()}
        >
          [EXIT]
        </button>
      </div>
    </div>
  );
};

export default HUD;
