
import { useEffect, useState } from "react";

interface FlashEffectProps {
  color: string | null;
  duration: number;
}

const FlashEffect = ({ color, duration }: FlashEffectProps) => {
  const [opacity, setOpacity] = useState(0.5);
  
  useEffect(() => {
    if (color) {
      setOpacity(0.5);
      
      const timer = setTimeout(() => {
        setOpacity(0);
      }, duration * (1000 / 30)); // Convert frames to milliseconds
      
      return () => clearTimeout(timer);
    }
  }, [color, duration]);
  
  if (!color) return null;
  
  return (
    <div 
      className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-300"
      style={{ 
        backgroundColor: color,
        opacity
      }}
    />
  );
};

export default FlashEffect;
