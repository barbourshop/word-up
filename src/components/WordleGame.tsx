
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

const WordleGame: React.FC = () => {
  const { toast } = useToast();
  
  // Get a random word instead of daily word
  const [solution, setSolution] = useState<string>(getRandomWord());
  
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
    const newWord = getRandomWord();
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
  
  // Handle keyboard input (both physical and on-screen)
  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setGameState(prevState => {
      const { guesses, currentRow, currentTile } = prevState;
      const currentGuess = [...guesses[currentRow]];
      
      // Handle letter input
      if (key.length === 1 && key.match(/[a-z]/i)) {
        if (currentTile < MAX_COLS) {
          currentGuess[currentTile] = { 
            letter: key.toUpperCase(), 
            status: 'tbd' 
          };
          
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
      }
      // Handle backspace
      else if (key === 'BACKSPACE') {
        if (currentTile > 0) {
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
      }
      // Handle enter
      else if (key === 'ENTER') {
        if (currentTile === MAX_COLS) {
          // Check if the guess is a valid word
          const word = currentGuess.map(tile => tile.letter).join('');
          
          if (!isValidWord(word)) {
            // Shake the row to indicate invalid word
            setShakingRow(currentRow);
            setTimeout(() => setShakingRow(null), 500);
            
            toast({
              description: "Not in word list",
              duration: 1000,
            });
            
            return prevState;
          }
          
          // Check the guess against the solution
          const checkedGuess = checkGuess(currentGuess, solution);
          
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
          } else if (lost) {
            newGameStatus = 'lost';
            
            toast({
              description: `The word was ${solution}`,
              duration: 3000,
            });
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
      }
      
      return prevState;
    });
  }, [gameState, solution, toast]);
  
  // Handle physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (key === 'BACKSPACE' || key === 'ENTER' || (key.length === 1 && key.match(/[A-Z]/))) {
        handleKeyPress(key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

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
