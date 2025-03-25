
import { motion } from "framer-motion";
import { Dices, RotateCcw } from "lucide-react";

interface LudoDiceProps {
  diceValue: number;
  isRolling: boolean;
  isDisabled: boolean;
  onRoll: () => void;
  onReset: () => void;
}

const LudoDice = ({ diceValue, isRolling, isDisabled, onRoll, onReset }: LudoDiceProps) => {
  return (
    <motion.div 
      className="glass-panel p-6 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div 
        className={`dice-container w-20 h-20 mb-5 flex items-center justify-center bg-game-card border-2 ${isRolling ? 'animate-pulse' : ''} border-game-accent rounded-lg`}
      >
        {diceValue === 1 && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        )}
        {diceValue === 2 && (
          <div className="grid grid-cols-2 gap-8 w-full h-full p-4">
            <div className="w-4 h-4 bg-white rounded-full self-start justify-self-start"></div>
            <div className="w-4 h-4 bg-white rounded-full self-end justify-self-end"></div>
          </div>
        )}
        {diceValue === 3 && (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-3">
            <div className="w-4 h-4 bg-white rounded-full self-start justify-self-start"></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="w-4 h-4 bg-white rounded-full self-center justify-self-center"></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="w-4 h-4 bg-white rounded-full self-end justify-self-end"></div>
          </div>
        )}
        {diceValue === 4 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-8 w-full h-full p-4">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        )}
        {diceValue === 5 && (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-3">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        )}
        {diceValue === 6 && (
          <div className="grid grid-cols-2 grid-rows-3 gap-4 w-full h-full p-3">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        <motion.button
          onClick={onRoll}
          disabled={isDisabled}
          whileHover={{ scale: isDisabled ? 1 : 1.05 }}
          whileTap={{ scale: isDisabled ? 1 : 0.95 }}
          className={`flex items-center gap-2 game-button ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <Dices className="h-5 w-5" />
          Roll Dice
        </motion.button>
        
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-game-card border border-game-border rounded-lg hover:border-game-accent/50 transition-all duration-300"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LudoDice;
