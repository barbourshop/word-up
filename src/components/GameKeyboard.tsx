import React from 'react';
import { cn } from '@/lib/utils';
import { TileStatus } from '@/utils/gameUtils';
import { CornerDownLeft, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatus: Record<string, TileStatus>;
}

const GameKeyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardStatus }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Get status color class based on tile status
  const getStatusColorClass = (key: string): string => {
    const status = keyboardStatus[key];
    switch (status) {
      case 'correct':
        return 'bg-wordle-correct text-white border-wordle-correct';
      case 'present':
        return 'bg-wordle-present text-white border-wordle-present';
      case 'absent':
        return 'bg-wordle-absent text-gray-700 border-wordle-absent';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto mb-4 px-1" data-testid="game-keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1.5">
          {rowIndex === 2 && (
            <Button
              className="h-12 px-2 text-xs sm:text-sm rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
              onClick={() => onKeyPress('BACKSPACE')}
            >
              <Delete size={16} />
              <span className="sr-only">BACKSPACE</span>
            </Button>
          )}
          
          {row.map(key => (
            <Button
              key={key}
              className={cn(
                'h-12 min-w-[28px] sm:min-w-[36px] md:min-w-[40px] px-0.5 sm:px-1 text-xs sm:text-sm rounded-md',
                getStatusColorClass(key)
              )}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </Button>
          ))}
          
          {rowIndex === 2 && (
            <Button 
              className="h-12 px-2 text-xs sm:text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
              onClick={() => onKeyPress('ENTER')}
            >
              <CornerDownLeft size={16} />
              <span className="sr-only">ENTER</span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameKeyboard;
