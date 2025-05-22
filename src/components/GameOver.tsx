
import { Player } from "@/game/types";

interface GameOverProps {
  player: Player;
  onRestart: () => void;
}

const GameOver = ({ player, onRestart }: GameOverProps) => {
  // Generate random mathematical symbols for the background
  const generateSymbols = () => {
    const symbols = "∑∏∆√∞∫≠≤≥±÷×ƒ∂∇πθλΩΨ∀∃∴∵∈⊂∪∩";
    return Array.from({length: 10}).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  };
  
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
        {Array.from({ length: 30 }).map((_, i) => (
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
      
      {/* Floating mathematical symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute text-red-500 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() + 0.5})`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`
            }}
          >
            {generateSymbols().join("\n")}
          </div>
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
        <p className="text-2xl md:text-3xl text-red-500 px-8 py-4 border-2 border-red-500 glitch"
           style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.7)' }}>
          Division by zero detected
        </p>
      </div>
      
      <div className="relative">
        <p className="text-2xl md:text-3xl mb-8 text-white border-2 border-red-500 px-8 py-4">
          Final Score: <span className="text-red-500">{player.score}</span>
        </p>
      </div>
      
      {/* ASCII skull with mathematical error */}
      <pre className="text-red-500 mb-6 text-xs md:text-sm">
{`
     .-""\`"-.
   .'        '.
  /   O    O   \\
 :            :
 |   ERROR:   |
 : lim(1/x)=∞ :
  \\  x→0     /
   '.    .'
     '-.-'
`}
      </pre>
      
      {/* Mathematical failure formula */}
      <div className="mb-8 text-white border border-red-500 bg-black/50 px-4 py-2">
        <code className="text-red-300">
          ∫(1/0)dx = undefined
        </code>
      </div>
      
      <p className="text-red-400 mt-4 animate-pulse">
        Press any key to restart, or ESC to quit.
      </p>
    </div>
  );
};

export default GameOver;
