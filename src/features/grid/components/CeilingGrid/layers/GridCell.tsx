import { memo } from "react";
import { Group, Rect } from "react-konva";
import type { GridComponent } from "../../../../../types";
import { useGridCell, useCanvasTheme } from "../../../hooks";
import { ComponentShape } from "./ComponentShape";

interface GridCellProps {
  readonly component: GridComponent;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly cellSize: number;
  readonly isSelected: boolean;
  readonly onSelect: (component: GridComponent) => void;
  readonly onDragStart: (component: GridComponent) => void;
  readonly onDragEnd: (row: number, col: number) => void;
}

function GridCellComponent({
  component,
  offsetX,
  offsetY,
  cellSize,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
}: GridCellProps) {
  const theme = useCanvasTheme();
  const { xPoint, yPoint, handleClick, handleDragStart, handleDragEnd } =
    useGridCell({
      component,
      offsetX,
      offsetY,
      cellSize,
      onSelect,
      onDragStart,
      onDragEnd,
    });

  return (
    <Group
      x={xPoint}
      y={yPoint}
      draggable
      onClick={handleClick}
      onTap={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isSelected && (
        <Rect
          x={0}
          y={0}
          width={cellSize}
          height={cellSize}
          stroke={theme.selectColor}
          strokeWidth={3}
        />
      )}
      <ComponentShape type={component.type} x={0} y={0} cellSize={cellSize} />
    </Group>
  );
}

export const GridCell = memo(GridCellComponent);
