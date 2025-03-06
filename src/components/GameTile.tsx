
import React from 'react';
import { cn } from '@/lib/utils';
import { Tile } from '@/utils/gameUtils';

interface GameTileProps {
  tile: Tile;
  animationDelay?: number;
  revealed?: boolean;
  shake?: boolean;
}

const GameTile: React.FC<GameTileProps> = ({ 
  tile, 
  animationDelay = 0,
  revealed = false,
  shake = false
}) => {
  // Determine tile styling based on status
  const getTileStyles = () => {
    if (!revealed) {
      return tile.letter 
        ? 'border-slate-400 bg-white' 
        : 'border-slate-200 bg-white';
    }
    
    switch (tile.status) {
      case 'correct':
        return 'border-wordle-correct bg-wordle-correct text-white';
      case 'present':
        return 'border-wordle-present bg-wordle-present text-white';
      case 'absent':
        return 'border-wordle-absent bg-wordle-absent text-slate-700';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  return (
    <div 
      className={cn(
        'game-tile',
        getTileStyles(),
        { 
          'animate-flip': revealed,
          'animate-bounce-in': tile.letter && !revealed,
          'animate-shake': shake
        }
      )} 
      style={{ 
        animationDelay: `${animationDelay}ms`,
        transformStyle: 'preserve-3d'
      }}
    >
      {tile.letter}
    </div>
  );
};

export default GameTile;
