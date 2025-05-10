
import { useEffect, useState } from "react";

interface MessageProps {
  text: string;
  timer: number;
}

const Message = ({ text, timer }: MessageProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (text && timer > 0) {
      setVisible(true);
      
      const timeout = setTimeout(() => {
        setVisible(false);
      }, timer * (1000 / 30)); // Convert frames to milliseconds
      
      return () => clearTimeout(timeout);
    } else {
      setVisible(false);
    }
  }, [text, timer]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed top-16 left-0 w-full flex justify-center z-20 pointer-events-none">
      <div className="bg-blue-900 text-white px-6 py-3 rounded-md shadow-lg">
        {text}
      </div>
    </div>
  );
};

export default Message;
