
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Trophy } from "lucide-react";
import LudoBoard from "./ludo/LudoBoard";
import LudoDice from "./ludo/LudoDice";
import { Piece, Player, PlayerColor } from "./ludo/LudoTypes";
import { 
  initializeGame, 
  checkMovablePieces, 
  movePiece, 
  getPiecePosition 
} from "./ludo/LudoGameLogic";

const LudoGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [canMove, setCanMove] = useState<boolean[]>([]);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);

  // Initialize the game
  useEffect(() => {
    if (gameStarted && !gameInProgress) {
      const newPlayers = initializeGame();
      setPlayers(newPlayers);
      setCurrentPlayerIndex(0);
      setWinner(null);
      setDiceValue(1);
      setIsRolling(false);
      setSelectedPiece(null);
      setCanMove([false, false, false, false]);
      setGameInProgress(true);
      toast("Ludo game started! You play as red.");
    }
  }, [gameStarted, gameInProgress]);

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    const newPlayers = initializeGame();
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setDiceValue(1);
    setIsRolling(false);
    setSelectedPiece(null);
    setCanMove([false, false, false, false]);
    toast("Game reset");
  };

  // Roll the dice
  const rollDice = () => {
    if (isRolling || winner) return;
    
    setIsRolling(true);
    setSelectedPiece(null);
    
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      setIsRolling(false);
      
      // Check which pieces can move
      const currentPlayer = players[currentPlayerIndex];
      const movablePieces = checkMovablePieces(currentPlayer, finalValue);
      setCanMove(movablePieces);
      
      // If no pieces can move, proceed to next player's turn
      if (!movablePieces.some(can => can)) {
        toast(`No valid moves available for ${currentPlayer.color}`);
        setTimeout(() => {
          nextTurn();
        }, 1500);
      } else if (currentPlayer.isComputer) {
        // Computer's turn - automatically select a piece to move
        setTimeout(() => {
          const pieceToMoveIndex = movablePieces.findIndex(can => can);
          if (pieceToMoveIndex !== -1) {
            handlePieceClick(currentPlayer.pieces[pieceToMoveIndex]);
          }
        }, 1000);
      }
    }, 1000);
  };

  // Handle piece selection and movement
  const handlePieceClick = (piece: Piece) => {
    const currentPlayer = players[currentPlayerIndex];
    
    // Only allow selecting pieces that belong to the current player and can move
    if (currentPlayer.color === piece.color && !isRolling && !winner) {
      const pieceIndex = currentPlayer.pieces.findIndex(p => p.id === piece.id);
      
      if (canMove[pieceIndex]) {
        setSelectedPiece(piece);
        
        // Move the piece
        const getAnotherTurn = movePiece(
          piece, 
          players, 
          currentPlayerIndex, 
          diceValue,
          setPlayers,
          setWinner
        );
        
        if (getAnotherTurn) {
          toast(`${currentPlayer.color} rolled a 6 and gets another turn!`);
          // Reset movable pieces
          setCanMove([false, false, false, false]);
        } else {
          nextTurn();
        }
      }
    }
  };

  // Proceed to next player's turn
  const nextTurn = () => {
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);
    setCanMove([false, false, false, false]);
    
    // If next player is a computer, automatically roll for them
    if (players[nextPlayerIndex].isComputer && !winner) {
      setTimeout(() => {
        rollDice();
      }, 1000);
    }
  };

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold mb-2">Ludo</h1>
        <p className="text-muted-foreground">Race your pieces around the board in this game of chance.</p>
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
            Ludo is a board game for 2-4 players. Roll a 6 to get your pieces out of the starting area. 
            Move your pieces around the board based on dice rolls, and try to get all four of your pieces to the center before your opponents do.
          </p>
          <button onClick={startGame} className="game-button">
            Start Game
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center">
          {winner && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-game-accent/20 border border-game-accent p-4 rounded-md mb-6 flex items-center gap-3"
            >
              <Trophy className="h-6 w-6 text-game-accent" />
              <span className="text-lg font-semibold">
                {winner.charAt(0).toUpperCase() + winner.slice(1)} player wins!
              </span>
            </motion.div>
          )}
          
          <div className="mb-6 text-xl flex items-center gap-2">
            <span className="font-medium">Current player: </span>
            <span className={`text-${players[currentPlayerIndex]?.color}-500 font-semibold`}>
              {players[currentPlayerIndex]?.color.charAt(0).toUpperCase() + players[currentPlayerIndex]?.color.slice(1)}
            </span>
            {players[currentPlayerIndex]?.isComputer && (
              <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Computer</span>
            )}
          </div>

          <div className="mb-8">
            <LudoBoard 
              players={players}
              currentPlayerIndex={currentPlayerIndex}
              canMove={canMove}
              handlePieceClick={handlePieceClick}
              getPiecePosition={getPiecePosition}
            />
          </div>
          
          <LudoDice 
            diceValue={diceValue}
            isRolling={isRolling}
            isDisabled={isRolling || (currentPlayerIndex !== 0 && !winner) || winner !== null}
            onRoll={rollDice}
            onReset={resetGame}
          />
          
          <div className="mt-6 text-center max-w-md glass-panel p-4">
            <p className="text-muted-foreground text-sm">
              Roll a 6 to get your pieces out of home. Once on the board, move your pieces based on your dice roll.
              Capture opponent pieces by landing on their squares. Get all your pieces to the center to win!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LudoGame;
