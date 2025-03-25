
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dices, ArrowDownUp, Users, Trophy, History } from "lucide-react";

type PlayerType = "human" | "computer";

interface Player {
  id: number;
  name: string;
  position: number;
  type: PlayerType;
  color: string;
}

interface GameHistoryEntry {
  player: number;
  roll: number;
  oldPosition: number;
  newPosition: number;
  snakeOrLadder: boolean;
}

const SnakeLadderGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [moveHistory, setMoveHistory] = useState<GameHistoryEntry[]>([]);
  const [gameMode, setGameMode] = useState<"singleplayer" | "multiplayer">("singleplayer");
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  
  // Define snakes and ladders - key is start, value is end
  const snakesAndLadders: Record<number, number> = {
    // ladders (start -> end)
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    51: 67,
    72: 91,
    80: 99,
    // snakes (start -> end)
    17: 7,
    54: 34,
    62: 19,
    64: 60,
    87: 36,
    93: 73,
    95: 75,
    98: 79
  };
  
  const playerColors = ["red-500", "blue-500", "green-500", "yellow-500"];
  
  // Initialize the game with players
  const initializeGame = () => {
    const newPlayers: Player[] = [];
    
    // Add human player
    newPlayers.push({
      id: 0,
      name: "You",
      position: 0,
      type: "human",
      color: playerColors[0]
    });
    
    // Add additional players
    for (let i = 1; i < numberOfPlayers; i++) {
      newPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        position: 0,
        type: gameMode === "multiplayer" ? "human" : "computer",
        color: playerColors[i]
      });
    }
    
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setMoveHistory([]);
  };
  
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted, gameMode, numberOfPlayers]);
  
  const startGame = () => {
    setGameStarted(true);
    toast(`Snake & Ladder game started with ${numberOfPlayers} players!`);
  };
  
  const resetGame = () => {
    initializeGame();
    setDiceValue(1);
    setCurrentPlayerIndex(0);
    setMoveHistory([]);
    setWinner(null);
    toast("Game reset");
  };
  
  const rollDice = () => {
    if (isRolling || winner) return;
    
    const currentPlayer = players[currentPlayerIndex];
    
    // Only allow the current player to roll if it's their turn
    if (currentPlayer.type === "computer" || 
        (currentPlayer.type === "human" && currentPlayer.id === 0) || 
        (gameMode === "multiplayer" && currentPlayer.type === "human")) {
      
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
        movePlayer(currentPlayerIndex, finalValue);
      }, 1000);
    }
  };
  
  const movePlayer = (playerIndex: number, roll: number) => {
    const player = players[playerIndex];
    let newPosition = player.position + roll;
    const oldPosition = player.position;
    
    // Cap at 100
    if (newPosition > 100) {
      newPosition = player.position;
      toast(`${player.name} needs exact roll to reach 100`);
    }
    
    // Update player position
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = {
      ...player,
      position: newPosition
    };
    
    let snakeOrLadderEffect = false;
    
    // Check for snakes and ladders
    if (snakesAndLadders[newPosition]) {
      setTimeout(() => {
        const destination = snakesAndLadders[newPosition];
        
        // Update position again
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          position: destination
        };
        
        setPlayers(updatedPlayers);
        
        if (destination > newPosition) {
          toast(`${player.name} climbed a ladder from ${newPosition} to ${destination}! 🪜`);
        } else {
          toast(`${player.name} hit a snake from ${newPosition} to ${destination}! 🐍`);
        }
        
        // Check for win after snake/ladder effect
        if (destination === 100) {
          setWinner(updatedPlayers[playerIndex]);
          toast(`${player.name} has won the game! 🎉`);
        } else {
          // Proceed to next turn after snake/ladder effect
          if (currentPlayerIndex === playerIndex) {
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            setCurrentPlayerIndex(nextPlayerIndex);
            
            // Auto-roll for computer players
            if (updatedPlayers[nextPlayerIndex].type === "computer" && !winner) {
              setTimeout(() => {
                rollDice();
              }, 1000);
            }
          }
        }
        
        // Add to move history with snake/ladder effect
        const historyEntry: GameHistoryEntry = {
          player: playerIndex,
          roll: roll,
          oldPosition: oldPosition,
          newPosition: destination,
          snakeOrLadder: true
        };
        
        setMoveHistory(prev => [...prev, historyEntry]);
      }, 500);
      
      snakeOrLadderEffect = true;
    }
    
    // Update players state
    setPlayers(updatedPlayers);
    
    // Check for win
    if (newPosition === 100) {
      setWinner(updatedPlayers[playerIndex]);
      toast(`${player.name} has won the game! 🎉`);
    } else if (!snakeOrLadderEffect) {
      // Only proceed to next turn if no snake/ladder effect
      // as that will handle the turn transition after animation
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextPlayerIndex);
      
      // Auto-roll for computer players
      if (updatedPlayers[nextPlayerIndex].type === "computer" && !winner) {
        setTimeout(() => {
          rollDice();
        }, 1000);
      }
    }
    
    // Add to move history
    if (!snakeOrLadderEffect) {
      const historyEntry: GameHistoryEntry = {
        player: playerIndex,
        roll: roll,
        oldPosition: oldPosition,
        newPosition: newPosition,
        snakeOrLadder: false
      };
      
      setMoveHistory(prev => [...prev, historyEntry]);
    }
  };
  
  const isSnakeStart = (position: number) => {
    return Object.keys(snakesAndLadders).includes(position.toString()) && 
           snakesAndLadders[position] < position;
  };
  
  const isLadderStart = (position: number) => {
    return Object.keys(snakesAndLadders).includes(position.toString()) && 
           snakesAndLadders[position] > position;
  };
  
  // Render square with position number
  const renderSquare = (position: number) => {
    // Snake and Ladder board numbering (bottom-to-top, alternating left-to-right and right-to-left)
    const row = Math.floor((100 - position) / 10);
    const isEvenRow = row % 2 === 0;
    const col = isEvenRow ? 9 - ((100 - position) % 10) : (100 - position) % 10;
    
    // Check if any player is on this square
    const playersOnSquare = players.filter(player => player.position === position);
    
    return (
      <motion.div
        key={position}
        whileHover={{ scale: 1.05 }}
        className={`
          w-full h-full flex items-center justify-center relative text-xs md:text-sm font-medium border
          ${isSnakeStart(position) ? 'bg-red-500/20 border-red-500' :
           isLadderStart(position) ? 'bg-green-500/20 border-green-500' :
           (row + col) % 2 === 0 ? 'bg-game-card border-game-border' : 'bg-game-dark border-game-border'}
          transition-all duration-200
        `}
      >
        <span className="absolute top-0.5 left-0.5 text-xs opacity-70">{position}</span>
        {isSnakeStart(position) && (
          <span className="text-red-500 text-sm md:text-base">🐍</span>
        )}
        {isLadderStart(position) && (
          <span className="text-green-500 text-sm md:text-base">🪜</span>
        )}
        
        {/* Player pieces */}
        {playersOnSquare.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`flex flex-wrap gap-0.5 p-0.5 ${playersOnSquare.length > 1 ? 'scale-75' : ''}`}>
              {playersOnSquare.map((player) => (
                <div
                  key={player.id}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-${player.color} border border-white z-10`}
                ></div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="page-transition min-h-[85vh] flex flex-col items-center justify-center py-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
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
          <h2 className="text-2xl font-semibold mb-6">Game Setup</h2>
          
          <div className="mb-6">
            <p className="text-left font-medium mb-2">Game Mode</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setGameMode("singleplayer")} 
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${gameMode === "singleplayer" ? 'bg-game-accent text-white' : 'bg-game-card'}`}
              >
                Single Player
              </button>
              <button 
                onClick={() => setGameMode("multiplayer")} 
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${gameMode === "multiplayer" ? 'bg-game-accent text-white' : 'bg-game-card'}`}
              >
                Multiplayer
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-left font-medium mb-2">Number of Players</p>
            <div className="flex gap-3">
              {[2, 3, 4].map(num => (
                <button 
                  key={num}
                  onClick={() => setNumberOfPlayers(num)} 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${numberOfPlayers === num ? 'bg-game-accent text-white' : 'bg-game-card'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex items-center mt-2 text-muted-foreground text-sm">
              <Users className="h-4 w-4 mr-1" />
              {gameMode === "singleplayer" ? 
                `You vs ${numberOfPlayers - 1} computer player${numberOfPlayers > 2 ? 's' : ''}` : 
                `${numberOfPlayers} human players`}
            </div>
          </div>
          
          <p className="mb-6 text-muted-foreground">
            Roll the dice and move your token up the board. Climb up ladders to advance faster, but watch out for snakes that will slide you back down! First player to reach 100 wins.
          </p>
          <button onClick={startGame} className="game-button">
            Start Game
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Game board */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            {winner && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-game-accent/20 border border-game-accent p-4 rounded-md mb-6 flex items-center gap-3"
              >
                <Trophy className="h-6 w-6 text-game-accent" />
                <span className="text-lg font-semibold">
                  {winner.name} wins the game!
                </span>
              </motion.div>
            )}
            
            <div className="mb-4 flex items-center">
              <span className="font-medium mr-2">Current player:</span>
              <div className={`flex items-center gap-2 py-1 px-3 rounded-md bg-${players[currentPlayerIndex]?.color}/20`}>
                <div className={`w-3 h-3 rounded-full bg-${players[currentPlayerIndex]?.color}`}></div>
                <span className="font-semibold">{players[currentPlayerIndex]?.name}</span>
                {players[currentPlayerIndex]?.type === "computer" && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">AI</span>
                )}
              </div>
            </div>

            <div className="game-board p-4 mb-6">
              <div className="grid grid-cols-10 gap-0.5 w-[300px] h-[300px] md:w-[400px] md:h-[400px] border-2 border-game-border">
                {/* Render all 100 squares */}
                {Array.from({ length: 100 }, (_, i) => renderSquare(100 - i))}
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
              
              <div className="flex space-x-4">
                <motion.button
                  onClick={rollDice}
                  disabled={isRolling || winner !== null || 
                    (players[currentPlayerIndex]?.type === "human" && 
                     gameMode === "multiplayer" && 
                     players[currentPlayerIndex]?.id !== 0)}
                  whileHover={{ scale: !isRolling && winner === null ? 1.05 : 1 }}
                  whileTap={{ scale: !isRolling && winner === null ? 0.95 : 1 }}
                  className={`flex items-center gap-2 game-button ${isRolling || winner !== null ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                  <ArrowDownUp className="h-4 w-4" />
                  Reset
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Game status and history */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel p-6 min-w-[250px] w-full lg:w-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Player Status</h3>
              <History className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="mb-6">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between mb-2 p-2 rounded-md bg-game-card">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${player.color}`}></div>
                    <span>{player.name}</span>
                    {player.type === "computer" && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">AI</span>
                    )}
                  </div>
                  <div className="font-semibold">{player.position}</div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Game History</h3>
              <div className="h-[200px] overflow-y-auto border border-game-border rounded-md p-2">
                {moveHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-2">No moves yet</p>
                ) : (
                  <div className="space-y-2">
                    {moveHistory.map((entry, index) => (
                      <div key={index} className="text-sm border-b border-game-border pb-1">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full bg-${players[entry.player]?.color}`}></div>
                          <span className="font-medium">{players[entry.player]?.name}</span>
                        </div>
                        <div className="ml-3 text-muted-foreground">
                          Rolled a {entry.roll}, moved from {entry.oldPosition} to {entry.newPosition}
                          {entry.snakeOrLadder && (
                            <span className="ml-1">
                              {entry.newPosition > entry.oldPosition + entry.roll ? '🪜' : '🐍'}
                            </span>
                          )}
                        </div>
                      </div>
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

export default SnakeLadderGame;
