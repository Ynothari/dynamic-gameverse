
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dices } from "lucide-react";

const LudoGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0: red, 1: green, 2: yellow, 3: blue
  
  const colors = ["red", "green", "yellow", "blue"];
  const colorClasses = [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-blue-500"
  ];
  
  const rollDice = () => {
    setIsRolling(true);
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      setIsRolling(false);
      setCurrentPlayer((currentPlayer + 1) % 4);
      toast(`Player ${colors[currentPlayer]} rolled ${finalValue}!`);
    }, 1000);
  };
  
  const startGame = () => {
    setGameStarted(true);
    toast("Ludo game started!");
  };

  // Create a board with 52 positions around the edge
  const boardPositions = Array(52).fill(null);

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
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
            Ludo is a board game for 2-4 players. Each player races their pieces around the board, trying to be the first to get all pieces to the center.
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
            <span className="font-medium">Current player: <span className={`text-${colors[currentPlayer]}-500`}>{colors[currentPlayer]}</span></span>
          </div>

          <div className="game-board p-4 mb-8 relative">
            <div className="grid grid-cols-11 grid-rows-11 gap-1 w-[330px] h-[330px] md:w-[400px] md:h-[400px]">
              {/* Create the colored home areas */}
              <div className={`col-span-5 row-span-5 ${colorClasses[0]} bg-opacity-20 border-2 border-red-500 rounded-tl-lg`}></div>
              <div className="col-span-1 row-span-5"></div>
              <div className={`col-span-5 row-span-5 ${colorClasses[1]} bg-opacity-20 border-2 border-green-500 rounded-tr-lg`}></div>
              
              <div className="col-span-5 row-span-1"></div>
              <div className="col-span-1 row-span-1"></div>
              <div className="col-span-5 row-span-1"></div>
              
              <div className={`col-span-5 row-span-5 ${colorClasses[2]} bg-opacity-20 border-2 border-yellow-500 rounded-bl-lg`}></div>
              <div className="col-span-1 row-span-5"></div>
              <div className={`col-span-5 row-span-5 ${colorClasses[3]} bg-opacity-20 border-2 border-blue-500 rounded-br-lg`}></div>
            </div>
            
            {/* Overlay the game pieces */}
            <div className="absolute top-6 left-6 grid grid-cols-2 gap-4">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
            </div>
            
            <div className="absolute top-6 right-6 grid grid-cols-2 gap-4">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
            </div>
            
            <div className="absolute bottom-6 left-6 grid grid-cols-2 gap-4">
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
            </div>
            
            <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
            </div>
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
            
            <motion.button
              onClick={rollDice}
              disabled={isRolling}
              whileHover={{ scale: isRolling ? 1 : 1.05 }}
              whileTap={{ scale: isRolling ? 1 : 0.95 }}
              className={`flex items-center gap-2 game-button ${isRolling ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Dices className="h-5 w-5" />
              Roll Dice
            </motion.button>
          </motion.div>
          
          <div className="mt-6 text-center max-w-md glass-panel p-4">
            <p className="text-muted-foreground text-sm">
              This is a simplified version of Ludo. In a full implementation, you would be able to move your pieces according to the dice roll.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LudoGame;
