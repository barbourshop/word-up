import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import GameBoard from './GameBoard';
import GameKeyboard from './GameKeyboard';
import GameHeader from './GameHeader';
import StatsDialog from './StatsDialog';
import InstructionsDialog from './InstructionsDialog';
import { 
  GameState, 
  TileStatus,
  initializeBoard, 
  checkGuess, 
  updateKeyboardStatus,
  saveGameState,
  loadGameState,
  getGameStats,
  updateGameStats
} from '@/utils/gameUtils';
import { getRandomWord, isValidWord } from '@/utils/wordList';

const MAX_ROWS = 6;
const MAX_COLS = 5;

// Add global error handlers for debugging
if (typeof window !== 'undefined') {
  window.addEventListener('error', function (event) {
    console.error('Global error:', event.error);
  });
  window.addEventListener('unhandledrejection', function (event) {
    console.error('Unhandled promise rejection:', event.reason);
  });
}

function getTestSolution(): string | null {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const testSolution = params.get('solution');
    if (testSolution && testSolution.length === 5) {
      return testSolution.toUpperCase();
    }
  }
  return null;
}

const WordleGame: React.FC = () => {
  const { toast } = useToast();
  
  const testSolution = getTestSolution();
  const [solution, setSolution] = useState<string>(testSolution || getRandomWord());
  
  // Game dialogs state
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  
  // Initialize the game state
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      guesses: initializeBoard(MAX_ROWS, MAX_COLS),
      currentRow: 0,
      currentTile: 0,
      solution: solution,
      gameStatus: 'playing',
      keyboardStatus: {}
    };
  });
  
  // Track the row that should be shaking (for invalid words)
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  
  // Get game stats
  const [stats, setStats] = useState(() => getGameStats());
  
  // Show instructions dialog on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('wordleHasVisited');
    if (!hasVisited) {
      setShowInstructions(true);
      localStorage.setItem('wordleHasVisited', 'true');
    }
  }, []);
  
  // Handle refreshing the game with a new word
  const handleRefreshGame = useCallback(() => {
    const newWord = getTestSolution() || getRandomWord();
    setSolution(newWord);
    
    setGameState({
      guesses: initializeBoard(MAX_ROWS, MAX_COLS),
      currentRow: 0,
      currentTile: 0,
      solution: newWord,
      gameStatus: 'playing',
      keyboardStatus: {}
    });
    
    toast({
      description: "New game started with a fresh word!",
      duration: 2000,
    });
  }, [toast]);
  
  // Handle keyboard input
  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setGameState(prevState => {
      const { guesses, currentRow, currentTile } = prevState;
      const currentGuess = [...guesses[currentRow]];
      
      // Handle letter input
      if (key.length === 1 && /[A-Z]/.test(key)) {
        // If we're at the end of the row, ignore
        if (currentTile >= MAX_COLS) return prevState;
        
        // Update the current tile with the pressed key
        currentGuess[currentTile] = { letter: key, status: 'tbd' };
        
        return {
          ...prevState,
          guesses: [
            ...guesses.slice(0, currentRow),
            currentGuess,
            ...guesses.slice(currentRow + 1)
          ],
          currentTile: currentTile + 1
        };
      }
      
      // Handle backspace
      if (key === 'BACKSPACE') {
        // If we're at the beginning of the row, ignore
        if (currentTile <= 0) return prevState;
        
        // Remove the letter from the current tile
        currentGuess[currentTile - 1] = { letter: '', status: 'empty' };
        
        return {
          ...prevState,
          guesses: [
            ...guesses.slice(0, currentRow),
            currentGuess,
            ...guesses.slice(currentRow + 1)
          ],
          currentTile: currentTile - 1
        };
      }
      
      // Handle enter
      if (key === 'ENTER') {
        // If we don't have a full word, ignore
        if (currentTile < MAX_COLS) {
          toast({
            description: "Word is too short",
            duration: 1000,
          });
          return prevState;
        }
        
        const word = currentGuess.map(tile => tile.letter).join('');
        
        if (!isValidWord(word)) {
          // Shake the row to indicate invalid word
          setShakingRow(currentRow);
          setTimeout(() => setShakingRow(null), 500);
          
          toast({
            description: "Not a valid 5-letter word",
            duration: 1000,
          });
          
          return prevState;
        }
        
        // Check the guess against the solution
        const checkedGuess = checkGuess(currentGuess, prevState.solution);
        
        // Update the guesses with the checked result
        const newGuesses = [
          ...guesses.slice(0, currentRow),
          checkedGuess,
          ...guesses.slice(currentRow + 1)
        ];
        
        // Update keyboard status
        const newKeyboardStatus = updateKeyboardStatus(
          prevState.keyboardStatus,
          checkedGuess
        );
        
        // Check if the player won
        const won = checkedGuess.every(tile => tile.status === 'correct');
        
        // Check if the player lost (all rows used)
        const lost = !won && currentRow === MAX_ROWS - 1;
        
        // Update game status
        let newGameStatus = prevState.gameStatus;
        if (won) {
          newGameStatus = 'won';
          
          toast({
            description: ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"][currentRow],
            duration: 2000,
          });
          
          // Update game stats
          updateGameStats(true, currentRow + 1);
          setStats(getGameStats());
        } else if (lost) {
          newGameStatus = 'lost';
          
          toast({
            description: `The word was ${prevState.solution}`,
            duration: 3000,
          });
          
          // Update game stats
          updateGameStats(false);
          setStats(getGameStats());
        }
        
        return {
          ...prevState,
          guesses: newGuesses,
          currentRow: currentRow + 1,
          currentTile: 0,
          gameStatus: newGameStatus,
          keyboardStatus: newKeyboardStatus
        };
      }
      
      return prevState;
    });
  }, [gameState, toast]);
  
  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;
      if (typeof e.key !== 'string') return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress, gameState.gameStatus]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <GameHeader 
        onOpenInstructions={() => setShowInstructions(true)}
        onOpenStats={() => setShowStats(true)}
        onRefreshGame={handleRefreshGame}
      />
      
      <main className="flex-1 w-full max-w-[500px] px-2 sm:px-4 py-6 flex flex-col justify-between">
        <GameBoard 
          guesses={gameState.guesses} 
          currentRow={gameState.currentRow} 
          shakingRow={shakingRow}
        />
        
        <GameKeyboard 
          onKeyPress={handleKeyPress} 
          keyboardStatus={gameState.keyboardStatus}
        />
      </main>
      
      <InstructionsDialog 
        open={showInstructions} 
        onOpenChange={setShowInstructions} 
      />
      
      <StatsDialog 
        open={showStats} 
        onOpenChange={setShowStats}
        stats={stats}
        gameState={gameState.gameStatus}
        solution={solution}
        guessCount={gameState.currentRow}
      />
    </div>
  );
};

export default WordleGame;
