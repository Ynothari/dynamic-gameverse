
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, RotateCcw, History } from "lucide-react";

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

interface Square {
  piece: Piece | null;
  isHighlighted: boolean;
  isCheck?: boolean;
}

type Position = { row: number; col: number };
type GameStatus = 'not-started' | 'in-progress' | 'check' | 'checkmate' | 'stalemate';

const ChessGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Square[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [gameStatus, setGameStatus] = useState<GameStatus>('not-started');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ 
    white: [], 
    black: [] 
  });

  // Initialize the board
  const initializeBoard = () => {
    const newBoard: Square[][] = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ piece: null, isHighlighted: false }))
    );

    // Set up pawns
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = { piece: { type: 'pawn', color: 'black' }, isHighlighted: false };
      newBoard[6][col] = { piece: { type: 'pawn', color: 'white' }, isHighlighted: false };
    }

    // Set up other pieces
    const setupRow = (row: number, color: PieceColor) => {
      newBoard[row][0] = { piece: { type: 'rook', color }, isHighlighted: false };
      newBoard[row][1] = { piece: { type: 'knight', color }, isHighlighted: false };
      newBoard[row][2] = { piece: { type: 'bishop', color }, isHighlighted: false };
      newBoard[row][3] = { piece: { type: 'queen', color }, isHighlighted: false };
      newBoard[row][4] = { piece: { type: 'king', color }, isHighlighted: false };
      newBoard[row][5] = { piece: { type: 'bishop', color }, isHighlighted: false };
      newBoard[row][6] = { piece: { type: 'knight', color }, isHighlighted: false };
      newBoard[row][7] = { piece: { type: 'rook', color }, isHighlighted: false };
    };

    setupRow(0, 'black');
    setupRow(7, 'white');

    return newBoard;
  };

  useEffect(() => {
    if (gameStarted) {
      setBoard(initializeBoard());
      setCurrentPlayer('white');
      setGameStatus('in-progress');
      setMoveHistory([]);
      setCapturedPieces({ white: [], black: [] });
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    toast("Chess game started! White moves first.");
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setGameStatus('in-progress');
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    toast("Game reset");
  };

  // Get chess piece unicode symbol
  const getPieceSymbol = (piece: Piece | null) => {
    if (!piece) return null;
    const symbols: Record<PieceType, Record<PieceColor, string>> = {
      pawn: { white: '♙', black: '♟' },
      rook: { white: '♖', black: '♜' },
      knight: { white: '♘', black: '♞' },
      bishop: { white: '♗', black: '♝' },
      queen: { white: '♕', black: '♛' },
      king: { white: '♔', black: '♚' }
    };
    return symbols[piece.type][piece.color];
  };

  // Get chess coordinates (e.g., a1, h8)
  const getChessCoordinates = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${files[col]}${ranks[row]}`;
  };

  // Get valid moves for a piece
  const getValidMoves = (row: number, col: number, tempBoard: Square[][] = board) => {
    const piece = tempBoard[row][col].piece;
    if (!piece) return [];

    const validMoves: Position[] = [];
    const { type, color } = piece;
    
    // Helper to check if position is valid
    const isValidPosition = (r: number, c: number) => {
      return r >= 0 && r < 8 && c >= 0 && c < 8;
    };

    // Helper to check if position is empty or has enemy piece
    const canMoveTo = (r: number, c: number) => {
      if (!isValidPosition(r, c)) return false;
      return !tempBoard[r][c].piece || tempBoard[r][c].piece?.color !== color;
    };

    // Helper to check if position has enemy piece
    const hasEnemyPiece = (r: number, c: number) => {
      if (!isValidPosition(r, c)) return false;
      return tempBoard[r][c].piece && tempBoard[r][c].piece?.color !== color;
    };

    // Helper to check if position is empty
    const isEmpty = (r: number, c: number) => {
      if (!isValidPosition(r, c)) return false;
      return !tempBoard[r][c].piece;
    };

    // Pawn moves
    if (type === 'pawn') {
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;
      
      // Move forward one square
      if (isEmpty(row + direction, col)) {
        validMoves.push({ row: row + direction, col });
        
        // Move forward two squares from starting position
        if (row === startRow && isEmpty(row + 2 * direction, col)) {
          validMoves.push({ row: row + 2 * direction, col });
        }
      }
      
      // Capture diagonally
      if (hasEnemyPiece(row + direction, col - 1)) {
        validMoves.push({ row: row + direction, col: col - 1 });
      }
      if (hasEnemyPiece(row + direction, col + 1)) {
        validMoves.push({ row: row + direction, col: col + 1 });
      }
      
      // TODO: En passant and promotion (for a full implementation)
    }
    
    // Rook moves
    if (type === 'rook' || type === 'queen') {
      // Horizontal and vertical moves
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        while (isValidPosition(r, c)) {
          if (isEmpty(r, c)) {
            validMoves.push({ row: r, col: c });
          } else if (hasEnemyPiece(r, c)) {
            validMoves.push({ row: r, col: c });
            break;
          } else {
            break;
          }
          r += dr;
          c += dc;
        }
      }
    }
    
    // Bishop moves
    if (type === 'bishop' || type === 'queen') {
      // Diagonal moves
      const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        while (isValidPosition(r, c)) {
          if (isEmpty(r, c)) {
            validMoves.push({ row: r, col: c });
          } else if (hasEnemyPiece(r, c)) {
            validMoves.push({ row: r, col: c });
            break;
          } else {
            break;
          }
          r += dr;
          c += dc;
        }
      }
    }
    
    // Knight moves
    if (type === 'knight') {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightMoves) {
        const r = row + dr;
        const c = col + dc;
        if (canMoveTo(r, c)) {
          validMoves.push({ row: r, col: c });
        }
      }
    }
    
    // King moves
    if (type === 'king') {
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      for (const [dr, dc] of kingMoves) {
        const r = row + dr;
        const c = col + dc;
        if (canMoveTo(r, c)) {
          validMoves.push({ row: r, col: c });
        }
      }
      
      // TODO: Castling (for a full implementation)
    }
    
    return validMoves;
  };

  // Check if a move would put the player's king in check
  const wouldBeInCheck = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Create a deep copy of the board
    const tempBoard = JSON.parse(JSON.stringify(board));
    
    // Make the move on the temporary board
    tempBoard[toRow][toCol].piece = tempBoard[fromRow][fromCol].piece;
    tempBoard[fromRow][fromCol].piece = null;
    
    // Find the king's position
    let kingPosition: Position | null = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = tempBoard[r][c].piece;
        if (piece && piece.type === 'king' && piece.color === currentPlayer) {
          kingPosition = { row: r, col: c };
          break;
        }
      }
      if (kingPosition) break;
    }
    
    if (!kingPosition) return false;
    
    // Check if any opponent's piece can capture the king
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = tempBoard[r][c].piece;
        if (piece && piece.color !== currentPlayer) {
          const validMoves = getValidMoves(r, c, tempBoard);
          if (validMoves.some(move => move.row === kingPosition?.row && move.col === kingPosition?.col)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (gameStatus !== 'in-progress' && gameStatus !== 'check') return;
    
    // If no square is selected
    if (!selectedSquare) {
      const piece = board[row][col].piece;
      
      // Can only select own pieces
      if (piece && piece.color === currentPlayer) {
        const validMoves = getValidMoves(row, col);
        
        // Filter out moves that would put or keep the king in check
        const legalMoves = validMoves.filter(
          move => !wouldBeInCheck(row, col, move.row, move.col)
        );
        
        // Highlight valid moves
        const newBoard = [...board];
        newBoard.forEach(row => row.forEach(square => square.isHighlighted = false));
        
        legalMoves.forEach(move => {
          newBoard[move.row][move.col].isHighlighted = true;
        });
        
        setBoard(newBoard);
        setSelectedSquare({ row, col });
      }
    } 
    // If a square is already selected
    else {
      // Clicking the same square unselects it
      if (selectedSquare.row === row && selectedSquare.col === col) {
        const newBoard = [...board];
        newBoard.forEach(row => row.forEach(square => square.isHighlighted = false));
        setBoard(newBoard);
        setSelectedSquare(null);
        return;
      }
      
      // Check if the clicked square is a valid move
      if (board[row][col].isHighlighted) {
        movePiece(selectedSquare.row, selectedSquare.col, row, col);
      } 
      // Clicking another of own pieces
      else if (board[row][col].piece?.color === currentPlayer) {
        handleSquareClick(row, col);
      } 
      // Clicking an invalid move
      else {
        const newBoard = [...board];
        newBoard.forEach(row => row.forEach(square => square.isHighlighted = false));
        setBoard(newBoard);
        setSelectedSquare(null);
      }
    }
  };

  // Move a piece
  const movePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = [...board];
    const movingPiece = newBoard[fromRow][fromCol].piece;
    const targetPiece = newBoard[toRow][toCol].piece;
    
    // Record move in algebraic notation
    const pieceSymbol = movingPiece?.type === 'pawn' ? '' : movingPiece?.type.charAt(0).toUpperCase();
    const captureSymbol = targetPiece ? 'x' : '';
    const fromCoord = getChessCoordinates(fromRow, fromCol);
    const toCoord = getChessCoordinates(toRow, toCol);
    const moveNotation = `${pieceSymbol}${fromCoord}${captureSymbol}${toCoord}`;
    
    // Handle captures
    if (targetPiece) {
      const newCapturedPieces = { ...capturedPieces };
      if (targetPiece.color === 'white') {
        newCapturedPieces.white = [...newCapturedPieces.white, targetPiece];
      } else {
        newCapturedPieces.black = [...newCapturedPieces.black, targetPiece];
      }
      setCapturedPieces(newCapturedPieces);
    }
    
    // Move the piece
    newBoard[toRow][toCol].piece = { ...movingPiece!, hasMoved: true };
    newBoard[fromRow][fromCol].piece = null;
    
    // Clear all highlights
    newBoard.forEach(row => row.forEach(square => square.isHighlighted = false));
    
    // Check for pawn promotion (simplified - auto queen)
    if (movingPiece?.type === 'pawn') {
      if ((movingPiece.color === 'white' && toRow === 0) || 
          (movingPiece.color === 'black' && toRow === 7)) {
        newBoard[toRow][toCol].piece = { type: 'queen', color: movingPiece.color };
        toast(`Pawn promoted to Queen!`);
      }
    }
    
    setBoard(newBoard);
    setSelectedSquare(null);
    setMoveHistory([...moveHistory, moveNotation]);
    
    // Switch player
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
    setCurrentPlayer(nextPlayer);
    
    // Check for check or checkmate
    checkGameStatus(newBoard, nextPlayer);
  };

  // Check for check, checkmate, or stalemate
  const checkGameStatus = (newBoard: Square[][], player: PieceColor) => {
    // Find king position
    let kingPosition: Position | null = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = newBoard[r][c].piece;
        if (piece && piece.type === 'king' && piece.color === player) {
          kingPosition = { row: r, col: c };
          break;
        }
      }
      if (kingPosition) break;
    }
    
    if (!kingPosition) return;
    
    // Check if king is in check
    let isInCheck = false;
    newBoard.forEach((row, r) => {
      row.forEach((square, c) => {
        const piece = square.piece;
        if (piece && piece.color !== player) {
          const validMoves = getValidMoves(r, c, newBoard);
          if (validMoves.some(move => move.row === kingPosition?.row && move.col === kingPosition?.col)) {
            isInCheck = true;
          }
        }
      });
    });
    
    // Check if player has any legal moves
    let hasLegalMoves = false;
    for (let r = 0; r < 8 && !hasLegalMoves; r++) {
      for (let c = 0; c < 8 && !hasLegalMoves; c++) {
        const piece = newBoard[r][c].piece;
        if (piece && piece.color === player) {
          const validMoves = getValidMoves(r, c, newBoard);
          for (const move of validMoves) {
            if (!wouldBeInCheck(r, c, move.row, move.col)) {
              hasLegalMoves = true;
              break;
            }
          }
        }
      }
    }
    
    // Update game status
    if (isInCheck && !hasLegalMoves) {
      setGameStatus('checkmate');
      const winner = player === 'white' ? 'Black' : 'White';
      toast(`Checkmate! ${winner} wins!`);
    } else if (isInCheck) {
      setGameStatus('check');
      toast(`${player === 'white' ? 'White' : 'Black'} is in check!`);
    } else if (!hasLegalMoves) {
      setGameStatus('stalemate');
      toast("Stalemate! The game is a draw.");
    } else {
      setGameStatus('in-progress');
    }
  };

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center py-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
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
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 flex justify-between items-center w-full">
              <div className="text-lg font-semibold">
                <span className={`${currentPlayer === 'black' ? 'text-game-accent' : ''}`}>
                  {gameStatus === 'check' && currentPlayer === 'black' ? '⚠️ ' : ''}
                  Black
                </span>
              </div>
              <div className="flex space-x-2">
                {capturedPieces.white.map((piece, i) => (
                  <div key={i} className="text-xl opacity-60">{getPieceSymbol(piece)}</div>
                ))}
              </div>
            </div>
            
            <div className="game-board p-4">
              <div className="grid grid-cols-8 w-[320px] md:w-[400px] h-[320px] md:h-[400px] border-2 border-game-accent">
                {board.map((row, rowIndex) => (
                  row.map((square, colIndex) => {
                    const isBlack = (rowIndex + colIndex) % 2 === 1;
                    const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                    
                    return (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          w-10 md:w-[50px] h-10 md:h-[50px] flex items-center justify-center relative
                          ${isBlack ? 'bg-gray-700' : 'bg-gray-300'} 
                          ${isSelected ? 'ring-2 ring-game-accent' : ''}
                          ${square.isHighlighted ? 'ring-2 ring-green-500' : ''}
                          cursor-pointer transition-all duration-200 hover:z-10
                        `}
                      >
                        {square.piece && (
                          <div className={`text-2xl ${square.piece.color === 'white' ? 'text-white' : 'text-black'}`}>
                            {getPieceSymbol(square.piece)}
                          </div>
                        )}
                        {square.isHighlighted && !square.piece && (
                          <div className="absolute w-3 h-3 rounded-full bg-green-500/60"></div>
                        )}
                        {square.isHighlighted && square.piece && (
                          <div className="absolute inset-0 bg-red-500/30 rounded-full"></div>
                        )}
                        
                        {/* Show coordinates on the edges */}
                        {colIndex === 0 && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 text-xs font-medium">
                            {8 - rowIndex}
                          </div>
                        )}
                        {rowIndex === 7 && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 text-xs font-medium">
                            {String.fromCharCode(97 + colIndex)}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center w-full">
              <div className="flex space-x-2">
                {capturedPieces.black.map((piece, i) => (
                  <div key={i} className="text-xl opacity-60">{getPieceSymbol(piece)}</div>
                ))}
              </div>
              <div className="text-lg font-semibold">
                <span className={`${currentPlayer === 'white' ? 'text-game-accent' : ''}`}>
                  {gameStatus === 'check' && currentPlayer === 'white' ? '⚠️ ' : ''}
                  White
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button 
                onClick={resetGame}
                className="px-4 py-2 flex items-center gap-2 bg-game-card border border-game-border rounded-lg hover:border-game-accent/50 transition-colors duration-300"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 min-w-[250px]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Game Status</h3>
              {gameStatus === 'checkmate' && (
                <div className="px-2 py-1 bg-red-500/20 text-red-500 rounded-md text-sm">
                  Checkmate
                </div>
              )}
              {gameStatus === 'check' && (
                <div className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md text-sm">
                  Check
                </div>
              )}
              {gameStatus === 'stalemate' && (
                <div className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-md text-sm">
                  Stalemate
                </div>
              )}
              {gameStatus === 'in-progress' && (
                <div className="px-2 py-1 bg-green-500/20 text-green-500 rounded-md text-sm">
                  In Progress
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <p className="mb-1 font-medium">Current Turn</p>
              <div className={`px-3 py-2 rounded-md ${currentPlayer === 'white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {currentPlayer === 'white' ? 'White' : 'Black'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Move History</p>
                <History className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="h-[200px] overflow-y-auto border border-game-border rounded-md p-2">
                {moveHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-2">No moves yet</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                      <React.Fragment key={i}>
                        <div className="text-sm">{i + 1}. {moveHistory[i * 2]}</div>
                        {moveHistory[i * 2 + 1] && (
                          <div className="text-sm">{moveHistory[i * 2 + 1]}</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;
