
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

type Player = "X" | "O";
type BoardType = (Player | null)[];

const TicTacToeGame = () => {
  const [board, setBoard] = useState<BoardType>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const checkWinner = (board: BoardType): { winner: Player | "draw" | null; line: number[] | null } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a] as Player, line: [a, b, c] };
      }
    }

    if (board.every(square => square !== null)) {
      return { winner: "draw", line: null };
    }

    return { winner: null, line: null };
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinLine(result.line);
      if (result.winner === "draw") {
        toast("Game ended in a draw!");
      } else {
        toast(`Player ${result.winner} wins!`);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinLine(null);
  };

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Tic Tac Toe</h1>
        <p className="text-muted-foreground">A 3x3 grid game where you place Xs and Os.</p>
      </motion.div>

      {!gameStarted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-8 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6 text-muted-foreground">
            Take turns placing X and O on the board. <br />
            The first player to get three in a row wins!
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
          <div className="mb-6 text-xl">
            {winner ? (
              winner === "draw" ? (
                <span className="font-medium">Game ended in a draw!</span>
              ) : (
                <span className="font-medium">Player <span className="text-game-accent">{winner}</span> wins!</span>
              )
            ) : (
              <span className="font-medium">Next player: <span className="text-game-accent">{isXNext ? "X" : "O"}</span></span>
            )}
          </div>

          <div className="game-board p-3 mb-6">
            <div className="grid grid-cols-3 gap-3">
              {board.map((value, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={!!value || !!winner}
                  whileHover={{ scale: value ? 1 : 1.05 }}
                  whileTap={{ scale: value ? 1 : 0.95 }}
                  className={`w-20 h-20 md:w-24 md:h-24 text-3xl md:text-4xl font-bold flex items-center justify-center
                              bg-game-dark border-2 transition-colors duration-300
                              ${winLine?.includes(index) 
                                ? 'border-game-accent text-game-accent' 
                                : 'border-game-border hover:border-game-accent/50'}`}
                >
                  {value && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {value}
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2 bg-game-card border border-game-border rounded-lg hover:border-game-accent/50 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Game
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default TicTacToeGame;
