
import { Player } from "@/game/types";

interface GameOverProps {
  player: Player;
  onRestart: () => void;
}

const GameOver = ({ player, onRestart }: GameOverProps) => {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      onClick={onRestart}
      tabIndex={0}
    >
      {/* 3D grid background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(transparent_0%,_rgba(255,_0,_0,_0.1)_10%,_rgba(255,_0,_0,_0.1)_90%,_transparent_100%)] bg-[length:50px_50px]"></div>
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,_transparent_0%,_rgba(255,_0,_0,_0.1)_10%,_rgba(255,_0,_0,_0.1)_90%,_transparent_100%)] bg-[length:50px_50px]"></div>
      </div>
      
      {/* Floating debris effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute math-symbol text-red-500 opacity-30"
            style={{
              fontSize: `${Math.random() * 30 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 8 + 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              textShadow: '0 0 10px rgba(255, 0, 0, 0.7)'
            }}
          >
            {['π', '∑', '∫', '∆', '∏'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-12 text-red-500 relative z-10"
          style={{ 
            textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 5px 10px rgba(0, 0, 0, 0.8)',
            transform: 'rotateX(10deg)',
            animation: 'pulse 2s infinite ease-in-out'
          }}>
        GAME OVER
      </h1>
      
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-red-900/30 rounded-xl transform scale-110"></div>
        <p className="text-2xl md:text-3xl mb-8 text-white relative z-10 px-8 py-4 rounded-xl bg-black/50 border border-red-800"
           style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
          Final Score: {player.score}
        </p>
      </div>
      
      <p className="text-gray-400 mt-12 animate-pulse relative z-10">
        Press any key to restart, or ESC to quit.
      </p>
    </div>
  );
};

export default GameOver;
