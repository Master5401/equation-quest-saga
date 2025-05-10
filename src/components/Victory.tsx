
import { Player } from "@/game/types";

interface VictoryProps {
  player: Player;
  onRestart: () => void;
}

const Victory = ({ player, onRestart }: VictoryProps) => {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-mono"
      onClick={onRestart}
      tabIndex={0}
    >
      {/* Retro Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(transparent_0%,_rgba(0,_255,_0,_0.05)_10%,_rgba(0,_255,_0,_0.05)_90%,_transparent_100%)] bg-[length:20px_20px]"></div>
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,_transparent_0%,_rgba(0,_255,_0,_0.05)_10%,_rgba(0,_255,_0,_0.05)_90%,_transparent_100%)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Code rain effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="absolute text-green-500 opacity-20 text-xs"
            style={{
              left: `${i * 3.3}%`,
              top: `-${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {Array.from({length: 20}).map((_, j) => (
              <div key={j} style={{opacity: Math.random() * 0.5 + 0.5}}>
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* ASCII Victory Text */}
      <pre className="text-green-500 text-base md:text-xl mb-8 leading-tight">
{`
 █░░█ ░▀░ █▀▀ ▀▀█▀▀ █▀▀█ █▀▀█ █░░█ █
 ▀▄▄▀ ▀█▀ █░░ ░░█░░ █░░█ █▄▄▀ █▄▄█ ▀
 ░▀▀░ ▀▀▀ ▀▀▀ ░░▀░░ ▀▀▀▀ ▀░▀▀ ▄▄▄█ ▄
`}
      </pre>
      
      <div className="relative mb-8">
        <p className="text-2xl md:text-3xl text-green-400 px-8 py-4 border-2 border-green-500"
           style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.7)' }}>
          You have restored the Grand Equation!
        </p>
      </div>

      <div className="relative mb-10 max-w-xl">
        <div className="bg-black border-2 border-green-500 p-4 md:p-6 text-green-400 text-sm md:text-base">
          <div className="border-b border-green-500 mb-4 pb-2 flex items-center">
            <div className="opacity-70">terminal@numerica:~$ echo "mission_complete"</div>
          </div>
          <div className="space-y-2">
            <p>The tear in reality has been mended.</p>
            <p>You've returned to your dorm room,</p>
            <p>your math assignment now showing a perfect score.</p>
            <p className="text-yellow-300 italic mt-4">"Remember the power of numbers. They are never just symbols."</p>
            <p className="opacity-60 mt-4 text-xs">Connection terminated...</p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <p className="text-2xl md:text-3xl mb-8 text-white border-2 border-green-500 px-8 py-4">
          Final Score: <span className="text-green-500">{player.score}</span>
        </p>
      </div>
      
      <p className="text-green-400 mt-8 animate-pulse">
        Press any key to play again, or ESC to quit.
      </p>
      
      {/* Grand Equation visual with ASCII art */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <pre className="text-cyan-400 text-sm">
{`
  ∫π dx = ∑(−1)^(n+1)/n^2
    n=1
`}
        </pre>
      </div>
    </div>
  );
};

export default Victory;
