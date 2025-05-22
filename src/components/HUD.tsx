
import { Player } from "@/game/types";
import { MAX_LEVELS } from "@/game/constants";

interface HUDProps {
  player: Player;
  currentLevel: number;
}

const HUD = ({ player, currentLevel }: HUDProps) => {
  // Calculate max capacity for the inventory based on level
  const maxCapacity = 3 + Math.floor(currentLevel / 2);
  
  // Format the player's score with thousands separators
  const formattedScore = new Intl.NumberFormat().format(player.score);
  
  return (
    <div className="w-full h-[50px] bg-black border-b-2 border-green-500 flex items-center px-4 text-green-400 font-mono">
      {/* Health with mathematical expression */}
      <div className="flex items-center space-x-2">
        <span className="text-lg">HP:</span>
        <div className="w-36 h-5 bg-black border border-green-600 relative">
          <div 
            className="h-full bg-green-600 absolute left-0 top-0 transition-all duration-300" 
            style={{ width: `${Math.max(0, player.health)}%` }}
          ></div>
          <div className="absolute left-0 top-0 h-full w-full flex items-center justify-center text-xs">
            <span className="mr-1">{player.health}</span>
            <span className="opacity-70">÷</span>
            <span className="ml-1">100</span>
          </div>
        </div>
      </div>
      
      {/* Score with scientific notation for large values */}
      <div className="ml-6 text-lg">
        <span className="opacity-70">SCORE:</span> 
        {player.score > 9999 
          ? <span className="font-bold">{(player.score/1000).toFixed(1)}×10<sup>3</sup></span>
          : formattedScore
        }
      </div>
      
      {/* Level with progression indicator */}
      <div className="ml-6 text-lg">
        <span className="opacity-70">LVL:</span>
        <span className="font-bold"> {currentLevel}</span>
        <span className="opacity-50">/{MAX_LEVELS}</span>
        <span className="ml-1 text-xs opacity-70">[{(currentLevel/MAX_LEVELS*100).toFixed(0)}%]</span>
      </div>
      
      {/* Inventory ASCII representation with capacity */}
      <div className="ml-6 text-lg overflow-hidden whitespace-nowrap">
        <span className="opacity-70">ITEMS:</span> 
        <span className="border-b border-green-700">
          {player.inventory.length > 0 
            ? player.inventory.join(" ") 
            : "[ ]"}
        </span>
        <span className="ml-1 text-xs opacity-50">{player.inventory.length}/{maxCapacity}</span>
      </div>
      
      {/* Exit Button with warning color */}
      <div className="ml-auto">
        <button 
          className="bg-black border border-red-500 hover:bg-red-900 px-4 py-1 text-red-500 transition-colors duration-200"
          onClick={() => window.location.reload()}
        >
          [EXIT]
        </button>
      </div>
    </div>
  );
};

export default HUD;
