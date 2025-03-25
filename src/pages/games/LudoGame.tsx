import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dices, RotateCcw, Trophy } from "lucide-react";

// Define types for Ludo
type PlayerColor = "red" | "green" | "yellow" | "blue";
type PieceStatus = "home" | "ready" | "playing" | "completed";

interface Piece {
  id: number;
  position: number;
  status: PieceStatus;
  distanceMoved: number;
  color: PlayerColor;
}

interface Player {
  color: PlayerColor;
  pieces: Piece[];
  isActive: boolean;
  isComputer: boolean;
}

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

  // Constants for the game
  const TOTAL_CELLS = 52;
  const HOME_ENTRANCE = {
    red: 0,
    green: 13,
    yellow: 26,
    blue: 39
  };
  const START_POSITION = {
    red: 0,
    green: 13,
    yellow: 26,
    blue: 39
  };

  // Initialize the game
  const initializeGame = () => {
    const newPlayers: Player[] = [
      {
        color: "red",
        pieces: Array(4).fill(null).map((_, i) => ({
          id: i,
          position: -1,
          status: "home",
          distanceMoved: 0,
          color: "red"
        })),
        isActive: true,
        isComputer: false
      },
      {
        color: "green",
        pieces: Array(4).fill(null).map((_, i) => ({
          id: i,
          position: -1,
          status: "home",
          distanceMoved: 0,
          color: "green"
        })),
        isActive: true,
        isComputer: true
      },
      {
        color: "yellow",
        pieces: Array(4).fill(null).map((_, i) => ({
          id: i,
          position: -1,
          status: "home",
          distanceMoved: 0,
          color: "yellow"
        })),
        isActive: true,
        isComputer: true
      },
      {
        color: "blue",
        pieces: Array(4).fill(null).map((_, i) => ({
          id: i,
          position: -1,
          status: "home",
          distanceMoved: 0,
          color: "blue"
        })),
        isActive: true,
        isComputer: true
      }
    ];
    
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setDiceValue(1);
    setIsRolling(false);
    setSelectedPiece(null);
    setCanMove([false, false, false, false]);
  };

  useEffect(() => {
    if (gameStarted && !gameInProgress) {
      initializeGame();
      setGameInProgress(true);
      toast("Ludo game started! You play as red.");
    }
  }, [gameStarted, gameInProgress]);

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    initializeGame();
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
            movePiece(currentPlayer.pieces[pieceToMoveIndex]);
          }
        }, 1000);
      }
    }, 1000);
  };

  // Check which pieces can move
  const checkMovablePieces = (player: Player, roll: number): boolean[] => {
    return player.pieces.map(piece => {
      // If piece is at home and rolled a 6, it can come out
      if (piece.status === "home" && roll === 6) {
        return true;
      }
      
      // If piece is already playing
      if (piece.status === "playing") {
        // Check if it will exceed the final position (56 steps in total to complete)
        if (piece.distanceMoved + roll <= 56) {
          return true;
        }
      }
      
      // If piece is ready but not yet in play
      if (piece.status === "ready" && roll === 6) {
        return true;
      }
      
      return false;
    });
  };

  // Handle piece selection
  const handlePieceClick = (piece: Piece) => {
    const currentPlayer = players[currentPlayerIndex];
    
    // Only allow selecting pieces that belong to the current player and can move
    if (currentPlayer.color === piece.color && !isRolling && !winner) {
      const pieceIndex = currentPlayer.pieces.findIndex(p => p.id === piece.id);
      
      if (canMove[pieceIndex]) {
        setSelectedPiece(piece);
        movePiece(piece);
      }
    }
  };

  // Move a piece
  const movePiece = (piece: Piece) => {
    if (isRolling || winner) return;
    
    const currentPlayer = players[currentPlayerIndex];
    const pieceIndex = currentPlayer.pieces.findIndex(p => p.id === piece.id);
    
    if (pieceIndex === -1 || !canMove[pieceIndex]) return;
    
    const newPlayers = [...players];
    const playerIndex = newPlayers.findIndex(p => p.color === currentPlayer.color);
    
    // If piece is at home and rolled a 6
    if (piece.status === "home" && diceValue === 6) {
      newPlayers[playerIndex].pieces[pieceIndex] = {
        ...piece,
        position: START_POSITION[currentPlayer.color as keyof typeof START_POSITION],
        status: "playing",
        distanceMoved: 0
      };
      
      toast(`${currentPlayer.color} piece ${piece.id + 1} enters the board!`);
    } 
    // If piece is already playing
    else if (piece.status === "playing") {
      // Calculate new position
      let newPosition = (piece.position + diceValue) % TOTAL_CELLS;
      let newDistanceMoved = piece.distanceMoved + diceValue;
      
      // Check if piece is entering its home stretch
      const homeEntrance = HOME_ENTRANCE[currentPlayer.color as keyof typeof HOME_ENTRANCE];
      
      if (piece.position <= homeEntrance && newPosition > homeEntrance) {
        // Piece is entering home stretch
        if (newDistanceMoved === 56) {
          // Piece has completed exactly 56 steps (completed)
          newPlayers[playerIndex].pieces[pieceIndex] = {
            ...piece,
            position: -2, // Special marker for completed
            status: "completed",
            distanceMoved: newDistanceMoved
          };
          
          toast(`${currentPlayer.color} piece ${piece.id + 1} has completed!`);
        } else {
          // Piece is still in the home stretch
          newPlayers[playerIndex].pieces[pieceIndex] = {
            ...piece,
            position: newPosition,
            distanceMoved: newDistanceMoved
          };
        }
      } else {
        // Regular movement
        newPlayers[playerIndex].pieces[pieceIndex] = {
          ...piece,
          position: newPosition,
          distanceMoved: newDistanceMoved
        };
      }
      
      // Check for captures (another player's piece on the same position)
      for (let i = 0; i < newPlayers.length; i++) {
        // Skip current player
        if (i === playerIndex) continue;
        
        // Check each piece of other players
        for (let j = 0; j < newPlayers[i].pieces.length; j++) {
          const otherPiece = newPlayers[i].pieces[j];
          
          // If the other piece is at the same position and is playing
          if (otherPiece.status === "playing" && otherPiece.position === newPosition) {
            // Send the piece back home
            newPlayers[i].pieces[j] = {
              ...otherPiece,
              position: -1,
              status: "home",
              distanceMoved: 0
            };
            
            toast(`${currentPlayer.color} captured ${newPlayers[i].color}'s piece!`);
          }
        }
      }
    }
    
    setPlayers(newPlayers);
    
    // Check if the player has won
    if (newPlayers[playerIndex].pieces.every(p => p.status === "completed")) {
      setWinner(currentPlayer.color);
      toast(`${currentPlayer.color} has won the game! 🎉`);
      return;
    }
    
    // If rolled a 6, player gets another turn
    if (diceValue === 6) {
      toast(`${currentPlayer.color} rolled a 6 and gets another turn!`);
      // Reset movable pieces
      setCanMove([false, false, false, false]);
    } else {
      nextTurn();
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

  // Get the absolute position of a piece on the board
  const getPiecePosition = (piece: Piece, playerColor: PlayerColor) => {
    if (piece.status === "home") {
      return { top: 0, left: 0 }; // Will be determined by the home base CSS
    }
    
    if (piece.status === "completed") {
      return { top: 0, left: 0 }; // Will be determined by the finish area CSS
    }
    
    // The board has 52 cells in a loop
    // Each player starts from a different position
    return { position: piece.position };
  };

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center py-8">
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
          
          <div className="mb-4 text-xl flex items-center gap-2">
            <span className="font-medium">Current player: </span>
            <span className={`text-${players[currentPlayerIndex]?.color}-500 font-semibold`}>
              {players[currentPlayerIndex]?.color.charAt(0).toUpperCase() + players[currentPlayerIndex]?.color.slice(1)}
            </span>
            {players[currentPlayerIndex]?.isComputer && (
              <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Computer</span>
            )}
          </div>

          <div className="game-board p-4 mb-8 relative">
            <div className="grid grid-cols-15 grid-rows-15 gap-0.5 w-[360px] h-[360px] md:w-[450px] md:h-[450px] border-2 border-game-border">
              {/* Red Home (Top Left) */}
              <div className="col-span-6 row-span-6 bg-red-500/20 border-2 border-red-500 rounded-tl-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {players[0]?.pieces.map((piece, index) => (
                    <motion.div
                      key={`red-${piece.id}`}
                      whileHover={{ scale: 1.1 }}
                      className={`w-6 h-6 rounded-full bg-red-500 cursor-pointer
                        ${canMove[index] && currentPlayerIndex === 0 ? 'ring-2 ring-white animate-pulse' : ''}
                        ${piece.status !== 'home' ? 'opacity-20' : 'opacity-100'}
                      `}
                      onClick={() => handlePieceClick(piece)}
                    ></motion.div>
                  ))}
                </div>
              </div>
              
              {/* Center column between red and green */}
              <div className="col-span-3 row-span-6"></div>
              
              {/* Green Home (Top Right) */}
              <div className="col-span-6 row-span-6 bg-green-500/20 border-2 border-green-500 rounded-tr-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {players[1]?.pieces.map((piece, index) => (
                    <motion.div
                      key={`green-${piece.id}`}
                      whileHover={{ scale: 1.1 }}
                      className={`w-6 h-6 rounded-full bg-green-500 cursor-pointer
                        ${canMove[index] && currentPlayerIndex === 1 ? 'ring-2 ring-white animate-pulse' : ''}
                        ${piece.status !== 'home' ? 'opacity-20' : 'opacity-100'}
                      `}
                      onClick={() => handlePieceClick(piece)}
                    ></motion.div>
                  ))}
                </div>
              </div>
              
              {/* Middle row */}
              <div className="col-span-6 row-span-3"></div>
              <div className="col-span-3 row-span-3 bg-gray-200 flex items-center justify-center">
                {/* Center area - finishing point */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  <div className="col-start-2 row-start-2 bg-red-500/50 flex items-center justify-center">
                    {players[0]?.pieces.filter(p => p.status === 'completed').length > 0 && (
                      <div className="text-sm font-bold text-white">
                        {players[0]?.pieces.filter(p => p.status === 'completed').length}
                      </div>
                    )}
                  </div>
                  <div className="col-start-3 row-start-2 bg-green-500/50 flex items-center justify-center">
                    {players[1]?.pieces.filter(p => p.status === 'completed').length > 0 && (
                      <div className="text-sm font-bold text-white">
                        {players[1]?.pieces.filter(p => p.status === 'completed').length}
                      </div>
                    )}
                  </div>
                  <div className="col-start-2 row-start-3 bg-yellow-500/50 flex items-center justify-center">
                    {players[2]?.pieces.filter(p => p.status === 'completed').length > 0 && (
                      <div className="text-sm font-bold text-white">
                        {players[2]?.pieces.filter(p => p.status === 'completed').length}
                      </div>
                    )}
                  </div>
                  <div className="col-start-1 row-start-2 bg-blue-500/50 flex items-center justify-center">
                    {players[3]?.pieces.filter(p => p.status === 'completed').length > 0 && (
                      <div className="text-sm font-bold text-white">
                        {players[3]?.pieces.filter(p => p.status === 'completed').length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-6 row-span-3"></div>
              
              {/* Yellow Home (Bottom Left) */}
              <div className="col-span-6 row-span-6 bg-yellow-500/20 border-2 border-yellow-500 rounded-bl-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {players[2]?.pieces.map((piece, index) => (
                    <motion.div
                      key={`yellow-${piece.id}`}
                      whileHover={{ scale: 1.1 }}
                      className={`w-6 h-6 rounded-full bg-yellow-500 cursor-pointer
                        ${canMove[index] && currentPlayerIndex === 2 ? 'ring-2 ring-white animate-pulse' : ''}
                        ${piece.status !== 'home' ? 'opacity-20' : 'opacity-100'}
                      `}
                      onClick={() => handlePieceClick(piece)}
                    ></motion.div>
                  ))}
                </div>
              </div>
              
              {/* Center column between yellow and blue */}
              <div className="col-span-3 row-span-6"></div>
              
              {/* Blue Home (Bottom Right) */}
              <div className="col-span-6 row-span-6 bg-blue-500/20 border-2 border-blue-500 rounded-br-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {players[3]?.pieces.map((piece, index) => (
                    <motion.div
                      key={`blue-${piece.id}`}
                      whileHover={{ scale: 1.1 }}
                      className={`w-6 h-6 rounded-full bg-blue-500 cursor-pointer
                        ${canMove[index] && currentPlayerIndex === 3 ? 'ring-2 ring-white animate-pulse' : ''}
                        ${piece.status !== 'home' ? 'opacity-20' : 'opacity-100'}
                      `}
                      onClick={() => handlePieceClick(piece)}
                    ></motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Playing pieces that are on the board */}
            {players.map((player) => 
              player.pieces.map((piece) => {
                if (piece.status !== 'playing') return null;
                
                // Calculate visual position on the board
                const position = getPiecePosition(piece, player.color);
                const trackPositions = [
                  // Top row (red to green)
                  { row: 1, col: 7 }, { row: 1, col: 8 }, { row: 1, col: 9 }, { row: 1, col: 10 }, { row: 1, col: 11 }, { row: 1, col: 12 },
                  // Right column (green to yellow)
                  { row: 2, col: 13 }, { row: 3, col: 13 }, { row: 4, col: 13 }, { row: 5, col: 13 }, { row: 6, col: 13 }, { row: 7, col: 13 },
                  // Bottom row (yellow to blue)
                  { row: 13, col: 12 }, { row: 13, col: 11 }, { row: 13, col: 10 }, { row: 13, col: 9 }, { row: 13, col: 8 }, { row: 13, col: 7 },
                  // Left column (blue to red)
                  { row: 12, col: 1 }, { row: 11, col: 1 }, { row: 10, col: 1 }, { row: 9, col: 1 }, { row: 8, col: 1 }, { row: 7, col: 1 }
                ];
                
                // Map the 52 positions to their visual coordinates
                const posIndex = position.position % 52;
                const cellPos = trackPositions[posIndex];
                
                // Apply a stacking effect for multiple pieces on the same spot
                const piecesAtSamePosition = player.pieces.filter(
                  p => p.status === 'playing' && p.position === piece.position
                );
                const pieceIndex = piecesAtSamePosition.findIndex(p => p.id === piece.id);
                
                return (
                  <motion.div
                    key={`${player.color}-${piece.id}-playing`}
                    className={`absolute w-6 h-6 rounded-full bg-${player.color}-500 border-2 border-white cursor-pointer transition-all duration-300 z-10`}
                    style={{
                      top: `${(cellPos.row * 20) + 10 + (pieceIndex * 4)}px`,
                      left: `${(cellPos.col * 20) + 10 + (pieceIndex * 4)}px`
                    }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handlePieceClick(piece)}
                  />
                );
              })
            )}
          </div>
          
          <motion.div 
            className="glass-panel p-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div 
              className={`dice-container w-16 h-16 mb-4 flex items-center justify-center bg-game-card border-2 ${isRolling ? 'animate-pulse' : ''} border-game-accent rounded-lg`}
            >
              {diceValue === 1 && <div className="w-4 h-4 bg-white rounded-full"></div>}
              {diceValue === 2 && <div className="grid grid-cols-2 gap-6"><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div></div>}
              {diceValue === 3 && <div className="grid grid-cols-3 gap-2"><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div></div>}
              {diceValue === 4 && <div className="grid grid-cols-2 gap-6"><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div></div>}
              {diceValue === 5 && <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-1"><div className="w-3 h-3 bg-white rounded-full"></div><div></div><div className="w-3 h-3 bg-white rounded-full"></div><div></div><div className="w-3 h-3 bg-white rounded-full"></div><div></div><div className="w-3 h-3 bg-white rounded-full"></div><div></div><div className="w-3 h-3 bg-white rounded-full"></div></div>}
              {diceValue === 6 && <div className="grid grid-cols-2 grid-rows-3 gap-2"><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div><div className="w-3 h-3 bg-white rounded-full"></div></div>}
            </div>
            
            <div className="flex space-x-4">
              <motion.button
                onClick={rollDice}
                disabled={isRolling || (currentPlayerIndex !== 0 && !winner) || winner !== null}
                whileHover={{ scale: isRolling || (currentPlayerIndex !== 0 && !winner) ? 1 : 1.05 }}
                whileTap={{ scale: isRolling || (currentPlayerIndex !== 0 && !winner) ? 1 : 0.95 }}
                className={`flex items-center gap-2 game-button ${isRolling || (currentPlayerIndex !== 0 && !winner) || winner !== null ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Dices className="h-5 w-5" />
                Roll Dice
              </motion.button>
              
              <motion.button
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-game-card border border-game-border rounded-lg hover:border-game-accent/50 transition-all duration-300"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </motion.button>
            </div>
          </motion.div>
          
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
