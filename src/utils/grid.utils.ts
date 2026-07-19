/**
 * Grid utility functions
 */

import type { GridPosition } from "../types";

/**
 * Creates a unique key for a grid position
 */
export const positionToKey = (pos: GridPosition): string =>
  `${pos.row}-${pos.col}`;

/**
 * Parses a position key back to GridPosition
 */
export const keyToPosition = (key: string): GridPosition => {
  const [row, col] = key.split("-").map(Number);
  return { row, col };
};

/**
 * Generates a unique component ID
 */
export const generateComponentId = (): string =>
  `comp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

/**
 * Converts pixel coordinates to grid position
 */
export const pixelToGridPosition = (
  pixelX: number,
  pixelY: number,
  offsetX: number,
  offsetY: number,
  cellSize: number,
): GridPosition => ({
  row: Math.floor((pixelY - offsetY) / cellSize),
  col: Math.floor((pixelX - offsetX) / cellSize),
});

/**
 * Checks if a grid position is within bounds
 */
export const isPositionInBounds = (
  pos: GridPosition,
  gridWidth: number,
  gridHeight: number,
): boolean =>
  pos.row >= 0 && pos.col >= 0 && pos.row < gridHeight && pos.col < gridWidth;
