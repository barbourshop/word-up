import React from 'react';
import GameRow from './GameRow';
import { Tile } from '@/utils/gameUtils';

interface GameBoardProps {
  guesses: Tile[][];
  currentRow: number;
  shakingRow: number | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentRow, shakingRow }) => {
  return (
    <div className="grid place-items-center mb-6" data-testid="main-board">
      {guesses.map((row, rowIndex) => (
        <GameRow 
          key={rowIndex} 
          tiles={row} 
          revealed={rowIndex < currentRow}
          shake={shakingRow === rowIndex}
        />
      ))}
    </div>
  );
};

export default GameBoard;
