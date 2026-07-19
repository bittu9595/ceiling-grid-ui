import { useCallback } from "react";
import type { GridComponent } from "../../../types";

interface UseGridCellProps {
  readonly component: GridComponent;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly cellSize: number;
  readonly onSelect: (component: GridComponent) => void;
  readonly onDragStart: (component: GridComponent) => void;
  readonly onDragEnd: (row: number, col: number) => void;
}

/*
 * Exposes drag and click handlers for a grid cell component.
 * Converts component position into the canvas coordinates used by Konva.
 */
export function useGridCell({
  component,
  offsetX,
  offsetY,
  cellSize,
  onSelect,
  onDragStart,
  onDragEnd,
}: UseGridCellProps) {
  const { row, col } = component.position;
  const xPoint = offsetX + col * cellSize;
  const yPoint = offsetY + row * cellSize;

  /*
   * Selects the current component and stops the event from bubbling.
   */
  const handleClick = useCallback(
    (event: { cancelBubble: boolean }) => {
      event.cancelBubble = true;
      onSelect(component);
    },
    [component, onSelect],
  );

  /*
   * Starts dragging the component and prevents the event from bubbling.
   */
  const handleDragStart = useCallback(
    (event: { cancelBubble: boolean }) => {
      event.cancelBubble = true;
      onDragStart(component);
    },
    [component, onDragStart],
  );

  /*
   * Computes the new row and column after a drag and snaps the item back into the grid.
   */
  const handleDragEnd = useCallback(
    (event: {
      target: {
        x: () => number;
        y: () => number;
        position: (pos: { x: number; y: number }) => void;
      };
      cancelBubble: boolean;
    }) => {
      event.cancelBubble = true;
      const newCol = Math.floor(
        (event.target.x() - offsetX + cellSize / 2) / cellSize,
      );
      const newRow = Math.floor(
        (event.target.y() - offsetY + cellSize / 2) / cellSize,
      );
      event.target.position({
        x: offsetX + newCol * cellSize,
        y: offsetY + newRow * cellSize,
      });
      onDragEnd(newRow, newCol);
    },
    [offsetX, offsetY, cellSize, onDragEnd],
  );

  return { xPoint, yPoint, handleClick, handleDragStart, handleDragEnd };
}
