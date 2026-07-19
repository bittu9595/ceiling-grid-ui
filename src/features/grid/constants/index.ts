// Re-export shared component constants
export {
  CEILING_COMPONENTS,
  CEILING_COMPONENTS as COMPONENTS,
  COMPONENT_COLORS,
  COMPONENT_SHAPES,
  type ComponentConfig,
} from "../../../constants/ceiling-components";

import type { GridPreset } from "../../../types";
export type { GridPreset } from "../../../types";

/** Base cell size in pixels at zoom level 1 */
export const BASE_CELL_SIZE = 40;

/** Default cell size in meters (physical grid unit) */
export const DEFAULT_CELL_SIZE_METERS = 0.6;

/** Format cell position for display */
export const formatCellInfo = (col: number, row: number): string => {
  const cellCol = col + 1;
  const cellRow = row + 1;
  const widthM = (cellCol * DEFAULT_CELL_SIZE_METERS).toFixed(1);
  const heightM = (cellRow * DEFAULT_CELL_SIZE_METERS).toFixed(1);
  return `Cell(${cellCol},${cellRow}) | ${widthM}m × ${heightM}m`;
};

/** Buffer in pixels for component virtualization during pan */
export const VIRTUALIZATION_BUFFER = 200;

/** Available grid size presets */
export const GRID_PRESETS: readonly GridPreset[] = [
  { label: "Small 10×10", width: 10, height: 10 },
  { label: "Medium 20×15", width: 20, height: 15 },
  { label: "Large 50×50", width: 50, height: 50 },
  { label: "Extra Large 100×100", width: 100, height: 100 },
  { label: "Stress 500×500", width: 500, height: 500 },
  { label: "Stress 1000×1000", width: 1000, height: 1000 },
];
