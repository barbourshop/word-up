
export type GameStatus = 'playing' | 'won' | 'lost';

export type TileStatus = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

export interface Tile {
  letter: string;
  status: TileStatus;
}

export interface GameState {
  guesses: Tile[][];
  currentRow: number;
  currentTile: number;
  solution: string;
  gameStatus: GameStatus;
  keyboardStatus: Record<string, TileStatus>;
}

// Initialize an empty game board
export const initializeBoard = (rows: number, columns: number): Tile[][] => {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(columns)
        .fill(null)
        .map(() => ({ letter: '', status: 'empty' }))
    );
};

// Check a guess against the solution
export const checkGuess = (guess: Tile[], solution: string): Tile[] => {
  const solutionArray = solution.split('');
  const result = [...guess];
  const solutionCount: Record<string, number> = {};
  
  // Count occurrences of each letter in the solution
  solutionArray.forEach(letter => {
    solutionCount[letter] = (solutionCount[letter] || 0) + 1;
  });
  
  // First, mark correct positions
  result.forEach((tile, i) => {
    if (tile.letter === solutionArray[i]) {
      result[i].status = 'correct';
      solutionCount[tile.letter]--;
    }
  });
  
  // Then, mark present or absent
  result.forEach((tile, i) => {
    if (tile.status !== 'correct') {
      if (solutionCount[tile.letter] && solutionCount[tile.letter] > 0) {
        result[i].status = 'present';
        solutionCount[tile.letter]--;
      } else {
        result[i].status = 'absent';
      }
    }
  });
  
  return result;
};

// Update keyboard statuses based on guesses
export const updateKeyboardStatus = (
  keyboardStatus: Record<string, TileStatus>,
  guess: Tile[]
): Record<string, TileStatus> => {
  const newStatus = { ...keyboardStatus };
  
  guess.forEach(tile => {
    const currentStatus = newStatus[tile.letter];
    
    // Only update if new status has higher priority
    if (
      !currentStatus ||
      (currentStatus !== 'correct' && 
       (tile.status === 'correct' || 
        (tile.status === 'present' && currentStatus !== 'present')))
    ) {
      newStatus[tile.letter] = tile.status;
    }
  });
  
  return newStatus;
};

// Save game state to localStorage
export const saveGameState = (state: GameState): void => {
  localStorage.setItem('wordleGameState', JSON.stringify(state));
  
  // Save the date of this game
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  localStorage.setItem('wordleGameDate', dateString);
};

// Load game state from localStorage
export const loadGameState = (todaySolution: string): GameState | null => {
  const storedState = localStorage.getItem('wordleGameState');
  const storedDate = localStorage.getItem('wordleGameDate');
  
  // Check if we have a stored game and if it's from today
  if (storedState && storedDate) {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // If the stored game is from today and has the same solution
    if (dateString === storedDate) {
      const state = JSON.parse(storedState) as GameState;
      
      // Verify the solution matches (in case algorithm changed)
      if (state.solution === todaySolution) {
        return state;
      }
    }
  }
  
  return null;
};

// Get game statistics from localStorage
export const getGameStats = (): { played: number; wins: number; streak: number; maxStreak: number; distribution: number[] } => {
  const stats = localStorage.getItem('wordleGameStats');
  
  if (stats) {
    return JSON.parse(stats);
  }
  
  return {
    played: 0,
    wins: 0,
    streak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0]
  };
};

// Update game statistics in localStorage
export const updateGameStats = (won: boolean, attempts?: number): void => {
  const stats = getGameStats();
  stats.played++;
  
  if (won) {
    stats.wins++;
    stats.streak++;
    
    if (stats.streak > stats.maxStreak) {
      stats.maxStreak = stats.streak;
    }
    
    if (attempts !== undefined && attempts > 0 && attempts <= 6) {
      stats.distribution[attempts - 1]++;
    }
  } else {
    stats.streak = 0;
  }
  
  localStorage.setItem('wordleGameStats', JSON.stringify(stats));
};
