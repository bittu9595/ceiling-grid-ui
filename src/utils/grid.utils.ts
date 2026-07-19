/**
 * Grid utility functions
 */

import type { GridPosition } from "../types";

/*
 * Creates a stable key string for a grid position.
 * Used to index components in the grid store by row and column.
 */
export const positionToKey = (pos: GridPosition): string =>
  `${pos.row}-${pos.col}`;

/*
 * Converts a stored grid key back into a row/column position.
 * Useful for reverse lookups from the component map.
 */
export const keyToPosition = (key: string): GridPosition => {
  const [row, col] = key.split("-").map(Number);
  return { row, col };
};

/*
 * Generates a unique component identifier.
 * Used when adding a new grid component instance.
 */
export const generateComponentId = (): string =>
  `comp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

/*
 * Maps pointer coordinates to the corresponding grid cell.
 * Helps translate canvas events into board positions.
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

/*
 * Validates whether a grid location is inside the board bounds.
 * Prevents component placement and interaction outside the grid.
 */
export const isPositionInBounds = (
  pos: GridPosition,
  gridWidth: number,
  gridHeight: number,
): boolean =>
  pos.row >= 0 && pos.col >= 0 && pos.row < gridHeight && pos.col < gridWidth;
