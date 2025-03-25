
import { toast } from "sonner";
import { Piece, Player, PlayerColor, HOME_ENTRANCE, START_POSITION, TOTAL_CELLS } from "./LudoTypes";

// Initialize the game
export const initializeGame = (): Player[] => {
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
  
  return newPlayers;
};

// Check which pieces can move
export const checkMovablePieces = (player: Player, roll: number): boolean[] => {
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

// Move a piece
export const movePiece = (
  piece: Piece, 
  players: Player[], 
  currentPlayerIndex: number, 
  diceValue: number,
  setPlayers: (players: Player[]) => void,
  setWinner: (winner: PlayerColor | null) => void
): boolean => {
  const currentPlayer = players[currentPlayerIndex];
  const pieceIndex = currentPlayer.pieces.findIndex(p => p.id === piece.id);
  
  if (pieceIndex === -1) return false;
  
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
    return false; // No need to continue to next turn
  }
  
  // Return whether player gets another turn (true if rolled a 6)
  return diceValue === 6;
};

// Get the absolute position of a piece on the board
export const getPiecePosition = (piece: Piece, playerColor: PlayerColor) => {
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
