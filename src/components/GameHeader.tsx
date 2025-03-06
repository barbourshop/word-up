
import React from 'react';
import { HelpCircle, BarChart2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface GameHeaderProps {
  onOpenInstructions: () => void;
  onOpenStats: () => void;
  onRefreshGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  onOpenInstructions,
  onOpenStats,
  onRefreshGame,
}) => {
  return (
    <header className="w-full py-2 px-4 flex items-center justify-between">
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onOpenInstructions}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefreshGame}
          title="New word"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold tracking-wider">WORDLE</h1>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onOpenStats}
      >
        <BarChart2 className="h-5 w-5" />
      </Button>
      
      <Separator className="absolute bottom-0 left-0 right-0" />
    </header>
  );
};

export default GameHeader;
