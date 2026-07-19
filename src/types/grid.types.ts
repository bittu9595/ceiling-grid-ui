/**
 * Grid-related type definitions
 */

import type { ComponentType } from "./core.types";

/**
 * Represents a single cell position in the grid
 */
export interface GridPosition {
  row: number;
  col: number;
}

/**
 * Represents a component placed on the grid
 */
export interface GridComponent {
  id: string;
  type: ComponentType;
  position: GridPosition;
  metadata?: Record<string, unknown>;
}

/**
 * Represents the state of the entire grid
 */
export interface GridState {
  width: number;
  height: number;
  components: Record<string, GridComponent>;
  cellSize: number; // in meters, default 0.6m
}

/**
 * Grid preset configuration for quick size selection
 */
export interface GridPreset {
  readonly label: string;
  readonly width: number;
  readonly height: number;
}

/**
 * Component statistics - derived from ComponentType
 */
export type ComponentStats = Record<ComponentType, number>;

/**
 * Camera/viewport state for pan and zoom
 */
export interface ViewportState {
  offsetX: number;
  offsetY: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}
