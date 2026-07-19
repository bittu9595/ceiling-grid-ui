import { memo } from "react";
import { Rect } from "react-konva";
import { useCanvasTheme } from "../../../hooks";

interface GridBackgroundProps {
  readonly width: number;
  readonly height: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly cellSize: number;
}

function GridBackgroundComponent({
  width,
  height,
  offsetX,
  offsetY,
  gridWidth,
  gridHeight,
  cellSize,
}: GridBackgroundProps) {
  const theme = useCanvasTheme();
  const tileWidth = gridWidth * cellSize;
  const tileHeight = gridHeight * cellSize;

  return (
    <>
      {/* Canvas background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={theme.canvasBg}
        listening={false}
      />
      {/* Grid area */}
      <Rect
        x={offsetX}
        y={offsetY}
        width={tileWidth}
        height={tileHeight}
        fill={theme.gridAreaBg}
        stroke={theme.gridAreaStroke}
        strokeWidth={theme.gridAreaStroke === "transparent" ? 0 : 1}
        listening={false}
      />
    </>
  );
}

export const GridBackground = memo(GridBackgroundComponent);
