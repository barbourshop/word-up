
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InstructionsDialog: React.FC<InstructionsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">How to Play</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm">
            Guess the word in 6 tries. After each guess, the color of the tiles will 
            change to show how close your guess was to the word.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="game-tile border-wordle-correct bg-wordle-correct text-white h-10 w-10 text-lg">W</div>
              <p className="text-sm">
                <strong>Green</strong> means the letter is correct and in the right spot.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="game-tile border-wordle-present bg-wordle-present text-white h-10 w-10 text-lg">I</div>
              <p className="text-sm">
                <strong>Yellow</strong> means the letter is in the word but in the wrong spot.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="game-tile border-wordle-absent bg-wordle-absent text-slate-700 h-10 w-10 text-lg">U</div>
              <p className="text-sm">
                <strong>Gray</strong> means the letter is not in the word.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold">Examples:</p>
            
            <div className="flex space-x-1">
              <div className="game-tile border-wordle-correct bg-wordle-correct text-white h-9 w-9 text-base">P</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">I</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">A</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">N</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">O</div>
            </div>
            <p className="text-xs">The letter P is in the word and in the correct spot.</p>
            
            <div className="flex space-x-1 mt-2">
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">F</div>
              <div className="game-tile border-wordle-present bg-wordle-present text-white h-9 w-9 text-base">L</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">A</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">M</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">E</div>
            </div>
            <p className="text-xs">The letter L is in the word but in the wrong spot.</p>
            
            <div className="flex space-x-1 mt-2">
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">C</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">R</div>
              <div className="game-tile border-wordle-absent bg-wordle-absent text-slate-700 h-9 w-9 text-base">A</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">N</div>
              <div className="game-tile border-slate-400 bg-white h-9 w-9 text-base">E</div>
            </div>
            <p className="text-xs">The letter A is not in the word in any spot.</p>
          </div>
          
          <p className="text-sm">
            A new word will be available each day!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
