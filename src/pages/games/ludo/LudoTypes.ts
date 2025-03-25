
// Define types for Ludo game
export type PlayerColor = "red" | "green" | "yellow" | "blue";
export type PieceStatus = "home" | "ready" | "playing" | "completed";

export interface Piece {
  id: number;
  position: number;
  status: PieceStatus;
  distanceMoved: number;
  color: PlayerColor;
}

export interface Player {
  color: PlayerColor;
  pieces: Piece[];
  isActive: boolean;
  isComputer: boolean;
}

export const TOTAL_CELLS = 52;

export const HOME_ENTRANCE = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

export const START_POSITION = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};
