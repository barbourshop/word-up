
import React from 'react';
import GameTile from './GameTile';
import { Tile } from '@/utils/gameUtils';

interface GameRowProps {
  tiles: Tile[];
  revealed?: boolean;
  shake?: boolean;
}

const GameRow: React.FC<GameRowProps> = ({ tiles, revealed = false, shake = false }) => {
  return (
    <div className="flex gap-1 md:gap-2 mb-1 md:mb-2">
      {tiles.map((tile, index) => (
        <GameTile 
          key={index} 
          tile={tile} 
          animationDelay={index * 300} 
          revealed={revealed}
          shake={shake} 
        />
      ))}
    </div>
  );
};

export default GameRow;
