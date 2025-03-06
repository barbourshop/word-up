
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
  
  // Input field reference for focusing
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Current input value
  const [inputValue, setInputValue] = useState<string>("");
  
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
    
    setInputValue("");
    
    toast({
      description: "New game started with a fresh word!",
      duration: 2000,
    });
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [toast]);
  
  // Handle keyboard input (both physical and on-screen)
  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    
    if (key === 'ENTER') {
      setGameState(prevState => {
        const { guesses, currentRow, currentTile } = prevState;
        
        // If we don't have a full word, ignore
        if (currentTile < MAX_COLS) {
          toast({
            description: "Word is too short",
            duration: 1000,
          });
          return prevState;
        }
        
        const currentGuess = [...guesses[currentRow]];
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
          
          // Update game stats
          updateGameStats(true, currentRow + 1);
          setStats(getGameStats());
        } else if (lost) {
          newGameStatus = 'lost';
          
          toast({
            description: `The word was ${solution}`,
            duration: 3000,
          });
          
          // Update game stats
          updateGameStats(false);
          setStats(getGameStats());
        }
        
        setInputValue("");
        
        return {
          ...prevState,
          guesses: newGuesses,
          currentRow: currentRow + 1,
          currentTile: 0,
          gameStatus: newGameStatus,
          keyboardStatus: newKeyboardStatus
        };
      });
    }
  }, [gameState, solution, toast]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    
    // Update the current row with the input value
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') return prevState;
      
      const { guesses, currentRow } = prevState;
      const currentGuess = [...guesses[currentRow]];
      
      // Clear the current row
      for (let i = 0; i < MAX_COLS; i++) {
        currentGuess[i] = { letter: '', status: 'empty' };
      }
      
      // Fill in the letters from the input value
      for (let i = 0; i < Math.min(value.length, MAX_COLS); i++) {
        currentGuess[i] = { letter: value[i], status: 'tbd' };
      }
      
      return {
        ...prevState,
        guesses: [
          ...guesses.slice(0, currentRow),
          currentGuess,
          ...guesses.slice(currentRow + 1)
        ],
        currentTile: Math.min(value.length, MAX_COLS)
      };
    });
  };

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        
        <div className="my-4 px-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            maxLength={5}
            className="w-full p-3 text-center text-xl font-medium border-2 border-gray-300 rounded"
            placeholder="Type your guess here"
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Word guess input"
          />
        </div>
        
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
