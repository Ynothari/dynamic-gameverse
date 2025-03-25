
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ChessGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  const pieces = [
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
    'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'
  ];
  
  const getPieceName = (piece: string, isWhite: boolean) => {
    const color = isWhite ? 'white' : 'black';
    return `${color}_${piece}`;
  };
  
  const startGame = () => {
    setGameStarted(true);
    toast("Chess game started! This is a simplified version.");
  };

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Chess</h1>
        <p className="text-muted-foreground">The classic strategic board game of kings and queens.</p>
      </motion.div>

      {!gameStarted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-8 text-center max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6 text-muted-foreground">
            Chess is a two-player strategy game played on a checkered board. Each player begins with 16 pieces: one king, one queen, two rooks, two knights, two bishops, and eight pawns.
          </p>
          <button onClick={startGame} className="game-button">
            Start Game
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="game-board mb-8">
            <div className="grid grid-cols-8 w-[320px] md:w-[400px] h-[320px] md:h-[400px]">
              {Array(64).fill(null).map((_, index) => {
                const row = Math.floor(index / 8);
                const col = index % 8;
                const isBlack = (row + col) % 2 === 1;
                
                // Determine if there's a piece on this square
                let piece = null;
                if (row < 2) {
                  // Black pieces
                  const pieceIndex = row === 0 ? col : 8 + col;
                  piece = getPieceName(pieces[pieceIndex], false);
                } else if (row > 5) {
                  // White pieces
                  const pieceIndex = row === 7 ? col : 8 + col;
                  piece = getPieceName(pieces[pieceIndex], true);
                }
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`w-10 md:w-[50px] h-10 md:h-[50px] flex items-center justify-center 
                               ${isBlack ? 'bg-gray-700' : 'bg-gray-300'} 
                               transition-all duration-200 hover:cursor-pointer hover:z-10`}
                  >
                    {piece && (
                      <div className="text-xl">
                        {piece.includes('pawn') && (piece.includes('white') ? '♙' : '♟')}
                        {piece.includes('rook') && (piece.includes('white') ? '♖' : '♜')}
                        {piece.includes('knight') && (piece.includes('white') ? '♘' : '♞')}
                        {piece.includes('bishop') && (piece.includes('white') ? '♗' : '♝')}
                        {piece.includes('queen') && (piece.includes('white') ? '♕' : '♛')}
                        {piece.includes('king') && (piece.includes('white') ? '♔' : '♚')}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center max-w-md glass-panel p-4">
            <p className="text-muted-foreground text-sm">
              This is a simplified version of Chess. Click on pieces to see possible moves. In a full implementation, you would be able to move pieces according to chess rules.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChessGame;
