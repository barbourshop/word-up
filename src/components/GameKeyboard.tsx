
import React from 'react';
import { cn } from '@/lib/utils';
import { TileStatus } from '@/utils/gameUtils';
import { CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatus: Record<string, TileStatus>;
}

const GameKeyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  return (
    <div className="w-full max-w-[500px] px-1 pb-6 mx-auto">
      <Button 
        className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        onClick={() => onKeyPress('ENTER')}
      >
        <CornerDownLeft size={20} />
        SUBMIT
      </Button>
    </div>
  );
};

export default GameKeyboard;
