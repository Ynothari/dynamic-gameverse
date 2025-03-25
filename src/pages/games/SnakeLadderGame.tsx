
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dices, ArrowDownUp } from "lucide-react";

const SnakeLadderGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(0);
  
  // Define snakes and ladders
  const snakesAndLadders = {
    // ladders (start -> end)
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    // snakes (start -> end)
    17: 7,
    54: 34,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    99: 78
  };
  
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      setIsRolling(false);
      
      // Move player
      const newPosition = Math.min(playerPosition + finalValue, 100);
      setPlayerPosition(newPosition);
      
      // Check for snakes and ladders
      if (snakesAndLadders[newPosition]) {
        setTimeout(() => {
          const destination = snakesAndLadders[newPosition];
          setPlayerPosition(destination);
          if (destination > newPosition) {
            toast("You climbed a ladder! 🪜");
          } else {
            toast("You hit a snake! 🐍");
          }
        }, 500);
      }
      
      // Check for win
      if (newPosition === 100) {
        toast("Congratulations! You won! 🎉");
      }
    }, 1000);
  };
  
  const startGame = () => {
    setGameStarted(true);
    setPlayerPosition(0);
    toast("Snake & Ladder game started!");
  };
  
  const resetGame = () => {
    setPlayerPosition(0);
    toast("Game reset");
  };

  const isSnakeStart = (position: number) => Object.keys(snakesAndLadders).includes(position.toString()) && snakesAndLadders[position] < position;
  const isLadderStart = (position: number) => Object.keys(snakesAndLadders).includes(position.toString()) && snakesAndLadders[position] > position;

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Snake & Ladder</h1>
        <p className="text-muted-foreground">Climb the ladders and avoid the snakes in this race to the top.</p>
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
            Roll the dice and move your token up the board. Climb up ladders to advance faster, but watch out for snakes that will slide you back down!
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
          <div className="mb-4 text-xl">
            <span className="font-medium">Player position: <span className="text-game-accent">{playerPosition}</span></span>
          </div>

          <div className="game-board p-4 mb-8">
            <div className="grid grid-cols-10 gap-1 w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
              {Array(100).fill(null).map((_, index) => {
                // Snake and Ladder board numbering (bottom-to-top, alternating left-to-right and right-to-left)
                const position = 100 - index;
                const row = Math.floor(index / 10);
                const isEvenRow = row % 2 === 0;
                const adjustedCol = isEvenRow ? index % 10 : 9 - (index % 10);
                const finalPosition = 100 - (row * 10 + adjustedCol);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      w-full h-full flex items-center justify-center text-xs font-medium border
                      ${playerPosition === finalPosition ? 'bg-game-accent text-game-dark' : 
                       isSnakeStart(finalPosition) ? 'bg-red-500/20 border-red-500' :
                       isLadderStart(finalPosition) ? 'bg-green-500/20 border-green-500' :
                       (row + adjustedCol) % 2 === 0 ? 'bg-game-card border-game-border' : 'bg-game-dark border-game-border'}
                      transition-all duration-200
                    `}
                  >
                    {finalPosition}
                    {isSnakeStart(finalPosition) && <span className="ml-1 text-red-500">🐍</span>}
                    {isLadderStart(finalPosition) && <span className="ml-1 text-green-500">🪜</span>}
                    {playerPosition === finalPosition && <span className="absolute w-3 h-3 rounded-full bg-white animate-pulse"></span>}
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
              
              <motion.button
                onClick={rollDice}
                disabled={isRolling || playerPosition === 100}
                whileHover={{ scale: isRolling ? 1 : 1.05 }}
                whileTap={{ scale: isRolling ? 1 : 0.95 }}
                className={`flex items-center gap-2 game-button ${(isRolling || playerPosition === 100) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Dices className="h-5 w-5" />
                Roll Dice
              </motion.button>
            </motion.div>
            
            <div className="glass-panel p-6">
              <motion.button
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-game-card border border-game-border rounded-lg hover:border-game-accent/50 transition-all duration-300"
              >
                <ArrowDownUp className="h-4 w-4" />
                Reset Game
              </motion.button>
            </div>
          </div>
          
          <div className="mt-6 text-center max-w-md glass-panel p-4">
            <p className="text-muted-foreground text-sm">
              Roll the dice to move up the board. Climb up ladders to advance faster, but watch out for snakes that will slide you back down!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SnakeLadderGame;
