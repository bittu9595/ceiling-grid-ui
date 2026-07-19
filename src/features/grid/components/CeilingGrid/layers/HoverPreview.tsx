import { memo } from "react";
import { Rect } from "react-konva";
import type { ToolType, ComponentType } from "../../../../../types";
import { COMPONENT_COLORS } from "../../../constants";
import { TOOL_TYPES } from "../../../../../constants/ceiling-components";
import { useCanvasTheme } from "../../../hooks";
import { ComponentShape } from "./ComponentShape";

interface HoverPreviewProps {
  readonly row: number;
  readonly col: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly cellSize: number;
  readonly selectedTool: ToolType;
}

function HoverPreviewComponent({
  row,
  col,
  offsetX,
  offsetY,
  cellSize,
  selectedTool,
}: HoverPreviewProps) {
  const theme = useCanvasTheme();
  const x = offsetX + col * cellSize;
  const y = offsetY + row * cellSize;
  const isPlacementTool = selectedTool in COMPONENT_COLORS;
  const color = isPlacementTool
    ? COMPONENT_COLORS[selectedTool as ComponentType]
    : "#999";

  // Border color based on tool
  const getBorderColor = () => {
    if (selectedTool === TOOL_TYPES.SELECT) return theme.selectColor;
    if (selectedTool === TOOL_TYPES.PAN) return theme.panColor;
    if (selectedTool === TOOL_TYPES.ERASER) return theme.eraserColor;
    return color;
  };

  return (
    <>
      {/* Hover border highlight */}
      <Rect
        x={x + 2}
        y={y + 2}
        width={cellSize - 4}
        height={cellSize - 4}
        fill={theme.hoverFill}
        stroke={getBorderColor()}
        strokeWidth={2}
        listening={false}
      />
      {/* Shape preview */}
      {isPlacementTool && (
        <ComponentShape
          type={selectedTool as ComponentType}
          x={x}
          y={y}
          cellSize={cellSize}
          opacity={0.5}
          listening={false}
        />
      )}
    </>
  );
}

export const HoverPreview = memo(HoverPreviewComponent);
