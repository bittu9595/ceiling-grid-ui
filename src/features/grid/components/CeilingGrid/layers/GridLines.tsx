import { Shape } from "react-konva";
import { memo, useCallback } from "react";
import { useCanvasTheme } from "../../../hooks";
import type { Context } from "konva/lib/Context";

interface GridLinesProps {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly cellSize: number;
}

function GridLinesComponent({
  offsetX,
  offsetY,
  gridWidth,
  gridHeight,
  cellSize,
}: GridLinesProps) {
  const theme = useCanvasTheme();

  const sceneFunc = useCallback(
    (ctx: Context) => {
      const context = ctx._context;
      context.strokeStyle = theme.gridLine;
      context.lineWidth = 1;
      context.beginPath();

      const gridRight = offsetX + gridWidth * cellSize;
      const gridBottom = offsetY + gridHeight * cellSize;

      // Vertical lines
      for (let col = 0; col <= gridWidth; col++) {
        const x = offsetX + col * cellSize;
        context.moveTo(x, offsetY);
        context.lineTo(x, gridBottom);
      }

      // Horizontal lines
      for (let row = 0; row <= gridHeight; row++) {
        const y = offsetY + row * cellSize;
        context.moveTo(offsetX, y);
        context.lineTo(gridRight, y);
      }

      context.stroke();
    },
    [offsetX, offsetY, gridWidth, gridHeight, cellSize, theme.gridLine],
  );

  return <Shape sceneFunc={sceneFunc} listening={false} />;
}

export const GridLines = memo(GridLinesComponent);
