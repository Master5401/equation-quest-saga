
import { Player } from "@/game/types";

interface GameOverProps {
  player: Player;
  onRestart: () => void;
}

const GameOver = ({ player, onRestart }: GameOverProps) => {
  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-mono"
      onClick={onRestart}
      tabIndex={0}
    >
      {/* Retro Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(transparent_0%,_rgba(255,_0,_0,_0.05)_10%,_rgba(255,_0,_0,_0.05)_90%,_transparent_100%)] bg-[length:20px_20px]"></div>
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,_transparent_0%,_rgba(255,_0,_0,_0.05)_10%,_rgba(255,_0,_0,_0.05)_90%,_transparent_100%)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Glitch texture */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-red-900 opacity-10" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 50}px`,
              height: '1px',
            }}></div>
        ))}
      </div>
      
      {/* ASCII Game Over Text */}
      <pre className="text-red-500 text-base md:text-xl mb-8 leading-tight">
{`
  █▀▀▀ █▀▀█ █▀▄▀█ █▀▀ 　 █▀▀█ ▀█░█▀ █▀▀ █▀▀█ 
  █░▀█ █▄▄█ █░▀░█ █▀▀ 　 █░░█ ░█▄█░ █▀▀ █▄▄▀ 
  ▀▀▀▀ ▀░░▀ ▀░░░▀ ▀▀▀ 　 ▀▀▀▀ ░░▀░░ ▀▀▀ ▀░▀▀
`}
      </pre>
      
      <div className="relative mb-8">
        <p className="text-2xl md:text-3xl text-red-500 px-8 py-4 border-2 border-red-500"
           style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.7)' }}>
          You have been lost to the void
        </p>
      </div>
      
      <div className="relative">
        <p className="text-2xl md:text-3xl mb-12 text-white border-2 border-red-500 px-8 py-4">
          Final Score: <span className="text-red-500">{player.score}</span>
        </p>
      </div>
      
      {/* ASCII skull */}
      <pre className="text-red-500 mb-8 text-xs md:text-sm">
{`
     .-""\`"-.
   .'        '.
  /   O    O   \\
 :            :
 |            |
 : .  '  .    :
  \\  '--'  /
   '.    .'
     '-.-'
`}
      </pre>
      
      <p className="text-red-400 mt-8 animate-pulse">
        Press any key to restart, or ESC to quit.
      </p>
    </div>
  );
};

export default GameOver;
