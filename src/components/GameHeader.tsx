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
    <header className="w-full py-2 px-4 relative flex items-center justify-between">
      <div className="flex gap-2 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onOpenInstructions}
          data-testid="instructions-btn"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshGame}
          title="New word"
          className="flex items-center gap-1 text-xs"
          data-testid="new-game-btn"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">New Word</span>
        </Button>
      </div>
      
      {/* Absolutely centered title, always aligned with the board */}
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-3xl font-bold tracking-wider text-center w-full pointer-events-none select-none">
        WORD UP
      </h1>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onOpenStats}
        data-testid="stats-btn"
        className="z-10"
      >
        <BarChart2 className="h-5 w-5" />
      </Button>
      
      <Separator className="absolute bottom-0 left-0 right-0" />
    </header>
  );
};

export default GameHeader;
