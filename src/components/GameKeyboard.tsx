
import React from 'react';
import { cn } from '@/lib/utils';
import { TileStatus } from '@/utils/gameUtils';
import { X, CornerDownLeft } from 'lucide-react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatus: Record<string, TileStatus>;
}

const GameKeyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardStatus }) => {
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyStyle = (key: string) => {
    if (key === 'ENTER') {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
    
    if (key === 'BACKSPACE') {
      return 'bg-gray-200 hover:bg-gray-300';
    }
    
    const status = keyboardStatus[key];
    switch (status) {
      case 'correct':
        return 'bg-wordle-correct text-white hover:bg-opacity-90';
      case 'present':
        return 'bg-wordle-present text-white hover:bg-opacity-90';
      case 'absent':
        return 'bg-wordle-absent text-slate-700 hover:bg-opacity-90';
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  const getKeyWidth = (key: string) => {
    if (key === 'ENTER' || key === 'BACKSPACE') {
      return 'w-auto min-w-[4.5rem] sm:min-w-[4.5rem]';
    }
    return 'w-[2rem] sm:w-[2.5rem]';
  };

  return (
    <div className="w-full max-w-[500px] px-1 pb-4 mx-auto">
      {keyboardRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center gap-1 my-1"
        >
          {row.map((key) => (
            <button
              key={key}
              className={cn(
                'keyboard-key h-12 rounded flex items-center justify-center font-medium transition-all',
                getKeyWidth(key),
                getKeyStyle(key)
              )}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? (
                <X size={18} className="mx-auto" />
              ) : key === 'ENTER' ? (
                <div className="flex items-center gap-1 px-1">
                  <CornerDownLeft size={16} />
                  <span className="text-xs sm:text-sm">ENTER</span>
                </div>
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameKeyboard;
