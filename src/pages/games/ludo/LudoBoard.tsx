
import { motion } from "framer-motion";
import { Piece, Player, PlayerColor } from "./LudoTypes";

interface LudoBoardProps {
  players: Player[];
  currentPlayerIndex: number;
  canMove: boolean[];
  handlePieceClick: (piece: Piece) => void;
  getPiecePosition: (piece: Piece, playerColor: PlayerColor) => { position: number } | { top: number, left: number };
}

const LudoBoard = ({ players, currentPlayerIndex, canMove, handlePieceClick, getPiecePosition }: LudoBoardProps) => {
  return (
    <div className="game-board relative mx-auto">
      <div className="aspect-square border-2 border-game-border bg-game-card/50 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-lg grid grid-cols-3 grid-rows-3 gap-1 p-2">
        {/* Red Home (Top Left) */}
        <div className="bg-red-500/20 border-2 border-red-500 rounded-tl-lg flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-2">
            {players[0]?.pieces.map((piece, index) => (
              <motion.div
                key={`red-${piece.id}`}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-full bg-red-500 cursor-pointer
                  ${canMove[index] && currentPlayerIndex === 0 ? 'ring-2 ring-white animate-pulse' : ''}
                  ${piece.status !== 'home' ? 'opacity-20' : 'opacity-100'}
                `}
                onClick={() => handlePieceClick(piece)}
              ></motion.div>
            ))}
          </div>
        </div>
        
        {/* Top Path */}
        <div className="bg-gray-200/20 border border-gray-300/30 grid grid-cols-3 grid-rows-1">
          <div className="border-b border-r border-gray-300/30"></div>
          <div className="border-b border-r border-gray-300/30"></div>
          <div className="border-b border-gray-300/30"></div>
        </div>
        
        {/* Green Home (Top Right) */}
        <div className="bg-green-500/20 border-2 border-green-500 rounded-tr-lg flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-2">
            {players[1]?.pieces.map((piece, index) => (
              <motion.div
                key={`green-${piece.id}`}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-full bg-green-500 cursor-pointer
                  ${canMove[index] && currentPlayerIndex === 1 ? 'ring-2 ring-white animate-pulse' : ''}
                  ${piece.status !== 'home' ? 'opacity-20' : 'opacity-100'}
                `}
                onClick={() => handlePieceClick(piece)}
              ></motion.div>
            ))}
          </div>
        </div>
        
        {/* Left Path */}
        <div className="bg-gray-200/20 border border-gray-300/30 grid grid-cols-1 grid-rows-3">
          <div className="border-r border-b border-gray-300/30"></div>
          <div className="border-r border-b border-gray-300/30"></div>
          <div className="border-r border-gray-300/30"></div>
        </div>
        
        {/* Center/Finish Area */}
        <div className="border border-gray-300/30 bg-gray-200/20 grid grid-cols-3 grid-rows-3">
          {/* Red finish path */}
          <div className="border-b border-r border-gray-300/30 bg-red-500/20"></div>
          <div className="border-b border-r border-gray-300/30 bg-red-500/30"></div>
          <div className="border-b border-r border-gray-300/30 bg-green-500/20"></div>
          
          {/* Blue finish path */}
          <div className="border-b border-r border-gray-300/30 bg-blue-500/30"></div>
          <div className="border-b border-r border-gray-300/30 bg-white/10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200/30 to-gray-400/30 backdrop-blur-sm flex items-center justify-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-1 w-10 h-10">
                <div className="bg-red-500/70 rounded-tl-md"></div>
                <div className="bg-green-500/70 rounded-tr-md"></div>
                <div className="bg-blue-500/70 rounded-bl-md"></div>
                <div className="bg-yellow-500/70 rounded-br-md"></div>
              </div>
            </div>
          </div>
          <div className="border-b border-r border-gray-300/30 bg-green-500/30"></div>
          
          {/* Yellow finish path */}
          <div className="border-r border-gray-300/30 bg-blue-500/20"></div>
          <div className="border-r border-gray-300/30 bg-yellow-500/30"></div>
          <div className="border-r border-gray-300/30 bg-yellow-500/20"></div>
        </div>
        
        {/* Right Path */}
        <div className="bg-gray-200/20 border border-gray-300/30 grid grid-cols-1 grid-rows-3">
          <div className="border-l border-b border-gray-300/30"></div>
          <div className="border-l border-b border-gray-300/30"></div>
          <div className="border-l border-gray-300/30"></div>
        </div>
        
        {/* Yellow Home (Bottom Left) */}
        <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-bl-lg flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-2">
            {players[2]?.pieces.map((piece, index) => (
              <motion.div
                key={`yellow-${piece.id}`}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-full bg-yellow-500 cursor-pointer
                  ${canMove[index] && currentPlayerIndex === 2 ? 'ring-2 ring-white animate-pulse' : ''}
                  ${piece.status !== 'home' ? 'opacity-20' : 'opacity-100'}
                `}
                onClick={() => handlePieceClick(piece)}
              ></motion.div>
            ))}
          </div>
        </div>
        
        {/* Bottom Path */}
        <div className="bg-gray-200/20 border border-gray-300/30 grid grid-cols-3 grid-rows-1">
          <div className="border-t border-r border-gray-300/30"></div>
          <div className="border-t border-r border-gray-300/30"></div>
          <div className="border-t border-gray-300/30"></div>
        </div>
        
        {/* Blue Home (Bottom Right) */}
        <div className="bg-blue-500/20 border-2 border-blue-500 rounded-br-lg flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-2">
            {players[3]?.pieces.map((piece, index) => (
              <motion.div
                key={`blue-${piece.id}`}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-full bg-blue-500 cursor-pointer
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
          
          // Define track positions based on the new grid layout
          const positions = [
            // Top row (red to green) - 5 positions
            { top: "10%", left: "35%" }, { top: "10%", left: "42%" }, { top: "10%", left: "50%" }, 
            { top: "10%", left: "58%" }, { top: "10%", left: "65%" },
            
            // Right side (green to yellow) - 5 positions
            { top: "22%", left: "80%" }, { top: "30%", left: "80%" }, { top: "40%", left: "80%" }, 
            { top: "50%", left: "80%" }, { top: "60%", left: "80%" },
            
            // Bottom row (yellow to blue) - 5 positions
            { top: "90%", left: "65%" }, { top: "90%", left: "58%" }, { top: "90%", left: "50%" }, 
            { top: "90%", left: "42%" }, { top: "90%", left: "35%" },
            
            // Left side (blue to red) - 5 positions
            { top: "60%", left: "20%" }, { top: "50%", left: "20%" }, { top: "40%", left: "20%" }, 
            { top: "30%", left: "20%" }, { top: "22%", left: "20%" },
          ];
          
          const posIndex = position.position % 20;
          const pos = positions[posIndex];
          
          // Apply a stacking effect for multiple pieces on the same spot
          const piecesAtSamePosition = player.pieces.filter(
            p => p.status === 'playing' && p.position === piece.position
          );
          const pieceIndex = piecesAtSamePosition.findIndex(p => p.id === piece.id);
          const offset = pieceIndex * 5; // Offset for stacked pieces
          
          return (
            <motion.div
              key={`${player.color}-${piece.id}-playing`}
              className={`absolute w-8 h-8 rounded-full bg-${player.color}-500 border-2 border-white cursor-pointer z-10`}
              style={{
                top: `calc(${pos.top} + ${offset}px)`,
                left: `calc(${pos.left} + ${offset}px)`,
              }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handlePieceClick(piece)}
            />
          );
        })
      )}
    </div>
  );
};

export default LudoBoard;
