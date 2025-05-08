import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    played: number;
    wins: number;
    streak: number;
    maxStreak: number;
    distribution: number[];
  };
  gameState: 'playing' | 'won' | 'lost';
  solution: string;
  guessCount: number;
}

const StatsDialog: React.FC<StatsDialogProps> = ({
  open,
  onOpenChange,
  stats,
  gameState,
  solution,
  guessCount,
}) => {
  // Calculate win percentage
  const winPercentage = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  
  // Find the maximum value in distribution for scaling the bars
  const maxDistribution = Math.max(...stats.distribution, 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="stats-dialog">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Game result if game is over */}
          {gameState !== 'playing' && (
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold mb-1">
                {gameState === 'won' ? 'You won!' : 'Game over!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                The word was <span className="font-bold">{solution}</span>
              </p>
              {gameState === 'won' && (
                <p className="text-sm text-muted-foreground">
                  You guessed it in {guessCount} {guessCount === 1 ? 'try' : 'tries'}
                </p>
              )}
            </div>
          )}
          
          {/* Stats summary */}
          <div className="grid grid-cols-4 gap-3 text-center mb-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{stats.played}</span>
              <span className="text-xs">Played</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{winPercentage}</span>
              <span className="text-xs">Win %</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{stats.streak}</span>
              <span className="text-xs">Streak</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{stats.maxStreak}</span>
              <span className="text-xs">Max Streak</span>
            </div>
          </div>
          
          {/* Guess distribution */}
          <div>
            <h3 className="text-center font-semibold mb-2">Guess Distribution</h3>
            <div className="space-y-1">
              {stats.distribution.map((count, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 text-right mr-1">{index + 1}</div>
                  <div 
                    className={`h-7 text-right pr-2 py-1 flex items-center justify-end ${
                      gameState === 'won' && guessCount === index + 1 
                        ? 'bg-wordle-correct text-white' 
                        : 'bg-muted'
                    }`}
                    style={{ 
                      width: `${Math.max((count / maxDistribution) * 100, 7)}%` 
                    }}
                  >
                    <span className="font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Play again tomorrow for a new word!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsDialog;
