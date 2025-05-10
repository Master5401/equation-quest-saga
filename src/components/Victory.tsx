
import { Player } from "@/game/types";

interface VictoryProps {
  player: Player;
  onRestart: () => void;
}

const Victory = ({ player, onRestart }: VictoryProps) => {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-blue-900 overflow-hidden"
      onClick={onRestart}
      tabIndex={0}
    >
      {/* 3D grid background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(transparent_0%,_rgba(0,_255,_255,_0.1)_10%,_rgba(0,_255,_255,_0.1)_90%,_transparent_100%)] bg-[length:40px_40px]"></div>
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,_transparent_0%,_rgba(0,_255,_255,_0.1)_10%,_rgba(0,_255,_255,_0.1)_90%,_transparent_100%)] bg-[length:40px_40px]"></div>
      </div>
      
      {/* Light beams */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-cyan-500/20 blur-lg"
            style={{
              width: '150px',
              height: '100vh',
              top: '0',
              left: `${25 + i * 25}%`,
              transform: 'rotate(15deg) translateY(-10%)',
              animation: `pulse ${3 + i}s infinite alternate ease-in-out`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Floating celebration symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="absolute math-symbol text-yellow-300 opacity-30"
            style={{
              fontSize: `${Math.random() * 30 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 8 + 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              textShadow: '0 0 10px rgba(255, 255, 0, 0.7)'
            }}
          >
            {['π', '∑', '∫', '∆', '∏', '=', '+'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-8 text-green-400 relative z-10"
          style={{ 
            textShadow: '0 0 20px rgba(0, 255, 0, 0.8), 0 5px 10px rgba(0, 0, 0, 0.8)',
            transform: 'perspective(500px) rotateX(10deg)',
          }}>
        VICTORY!
      </h1>
      
      <div className="relative mb-10">
        <div className="absolute inset-0 blur-xl bg-cyan-500/30 rounded-xl transform scale-110"></div>
        <p className="text-2xl md:text-3xl text-yellow-300 relative z-10 px-8 py-4 rounded-xl bg-blue-800/50 border border-cyan-500"
           style={{ textShadow: '0 0 10px rgba(255, 255, 0, 0.5)' }}>
          You have restored the Grand Equation!
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 blur-md bg-green-500/20 rounded-lg transform scale-105"></div>
        <p className="text-2xl md:text-3xl mb-12 text-white relative z-10 px-6 py-3 rounded-lg bg-blue-900/70 border border-green-400"
           style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
          Final Score: {player.score}
        </p>
      </div>
      
      <p className="text-gray-300 mt-8 animate-pulse relative z-10">
        Press any key to play again, or ESC to quit.
      </p>
      
      {/* Grand Equation visual */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <div className="text-xl md:text-3xl text-cyan-400"
             style={{
               fontFamily: 'monospace',
               textShadow: '0 0 10px rgba(0, 255, 255, 0.7)',
               transform: 'perspective(500px) rotateX(5deg)',
             }}>
          ∫<span className="text-yellow-300">π</span>dx = <span className="text-green-400">∑</span><sub>n=1</sub><sup>∞</sup><span className="text-pink-400">(−1)<sup>n+1</sup></span>/<span className="text-orange-400">n<sup>2</sup></span>
        </div>
      </div>
    </div>
  );
};

export default Victory;
