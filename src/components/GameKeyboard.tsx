
import React from 'react';
import { cn } from '@/lib/utils';
import { TileStatus } from '@/utils/gameUtils';
import { X } from 'lucide-react';

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
    if (key === 'ENTER' || key === 'BACKSPACE') {
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

  return (
    <div className="w-full max-w-[500px] px-1 sm:px-2 mx-auto">
      {keyboardRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center gap-1 sm:gap-1.5 my-1.5"
        >
          {row.map((key) => (
            <button
              key={key}
              className={cn(
                'keyboard-key',
                getKeyStyle(key)
              )}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? (
                <X size={20} className="mr-0 sm:mr-1" />
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
