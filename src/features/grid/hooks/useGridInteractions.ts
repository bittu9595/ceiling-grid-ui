import { useState, useCallback } from "react";
import type { GridComponent, GridPosition } from "../../../types";
import { useAppStore } from "../../../store";
import { TOOL_TYPES } from "../../../constants/ceiling-components";
import {
  positionToKey,
  pixelToGridPosition,
  isPositionInBounds,
} from "../../../utils/grid.utils";

interface UseGridInteractionsProps {
  readonly cellSize: number;
}

/*
 * Handles pointer-driven grid interactions.
 * Manages hover, selection, placement, dragging, and pan behavior for the canvas.
 */
export function useGridInteractions({ cellSize }: UseGridInteractionsProps) {
  const [hoverCell, setHoverCell] = useState<GridPosition | null>(null);
  const [dragTarget, setDragTarget] = useState<GridComponent | null>(null);

  // Store
  const grid = useAppStore((state) => state.grid);
  const viewport = useAppStore((state) => state.viewport);
  const selectedTool = useAppStore((state) => state.ui.selectedTool);
  const addComponent = useAppStore((state) => state.addComponent);
  const removeComponent = useAppStore((state) => state.removeComponent);
  const moveComponent = useAppStore((state) => state.moveComponent);
  const selectComponent = useAppStore((state) => state.selectComponent);
  const setOffset = useAppStore((state) => state.setOffset);

  /*
   * Handle a click on the canvas stage and place or select a grid item.
   */
  const handleStageClick = useCallback(
    (event: { target: { getStage: () => unknown }; evt: MouseEvent }) => {
      if (event.target !== event.target.getStage()) return; // Clicked on a shape, not stage

      const { offsetX: x, offsetY: y } = event.evt;
      const pos = pixelToGridPosition(
        x,
        y,
        viewport.offsetX,
        viewport.offsetY,
        cellSize,
      );

      if (!isPositionInBounds(pos, grid.width, grid.height)) return;

      const key = positionToKey(pos);
      const existing = grid.components[key];

      if (selectedTool === TOOL_TYPES.SELECT) {
        selectComponent(existing ?? null);
      } else if (selectedTool === TOOL_TYPES.ERASER && existing) {
        removeComponent(pos);
      } else if (
        selectedTool !== TOOL_TYPES.PAN &&
        selectedTool !== TOOL_TYPES.ERASER &&
        !existing
      ) {
        addComponent(selectedTool, pos);
      }
    },
    [
      viewport,
      cellSize,
      grid,
      selectedTool,
      addComponent,
      removeComponent,
      selectComponent,
    ],
  );

  /*
   * Track the current pointer cell so the hover preview can follow the cursor.
   */
  const handleStageMouseMove = useCallback(
    (event: { evt: MouseEvent }) => {
      const { offsetX: x, offsetY: y } = event.evt;
      const pos = pixelToGridPosition(
        x,
        y,
        viewport.offsetX,
        viewport.offsetY,
        cellSize,
      );

      if (isPositionInBounds(pos, grid.width, grid.height)) {
        setHoverCell(pos);
      } else {
        setHoverCell(null);
      }
    },
    [viewport, cellSize, grid.height, grid.width],
  );

  /*
   * Clear the hover cell when the pointer leaves the canvas surface.
   */
  const handleStageMouseLeave = useCallback(() => {
    setHoverCell(null);
  }, []);

  /*
   * Commit the drag offset once the pan interaction finishes.
   */
  const handleStageDragEnd = useCallback(
    (event: {
      target: {
        x: () => number;
        y: () => number;
        position: (pos: { x: number; y: number }) => void;
      };
    }) => {
      const newOffsetX = viewport.offsetX + event.target.x();
      const newOffsetY = viewport.offsetY + event.target.y();
      setOffset(newOffsetX, newOffsetY);
      event.target.position({ x: 0, y: 0 });
    },
    [viewport.offsetX, viewport.offsetY, setOffset],
  );

  /*
   * Select or erase the clicked component based on the current tool.
   */
  const handleCellSelect = useCallback(
    (component: GridComponent) => {
      if (selectedTool === TOOL_TYPES.ERASER) {
        removeComponent(component.position);
      } else {
        selectComponent(component);
      }
    },
    [selectedTool, removeComponent, selectComponent],
  );

  /*
   * Capture the component being dragged so its destination can be applied later.
   */
  const handleCellDragStart = useCallback((component: GridComponent) => {
    setDragTarget(component);
  }, []);

  /*
   * Update the moved component position and clamp it to the grid bounds.
   */
  const handleCellDragEnd = useCallback(
    (row: number, col: number) => {
      if (dragTarget) {
        // Clamp to grid bounds
        const newRow = Math.max(0, Math.min(row, grid.height - 1));
        const newCol = Math.max(0, Math.min(col, grid.width - 1));
        moveComponent(dragTarget.position, { row: newRow, col: newCol });
        setDragTarget(null);
      }
    },
    [dragTarget, grid, moveComponent],
  );

  return {
    hoverCell,
    dragTarget,
    handleStageClick,
    handleStageMouseMove,
    handleStageMouseLeave,
    handleCellSelect,
    handleCellDragStart,
    handleCellDragEnd,
    handleStageDragEnd,
  };
}
