import { memo } from "react";
import { Rect, Circle, Line, Group } from "react-konva";
import type { ComponentType } from "../../../../../types";
import { COMPONENT_COLORS, COMPONENT_SHAPES } from "../../../constants";

interface ComponentShapeProps {
  readonly type: ComponentType;
  readonly x: number;
  readonly y: number;
  readonly cellSize: number;
  readonly opacity?: number;
  readonly listening?: boolean;
}

function ComponentShapeComponent({
  type,
  x,
  y,
  cellSize,
  opacity = 1,
  listening = true,
}: ComponentShapeProps) {
  const color = COMPONENT_COLORS[type] ?? "#6b7280";
  const shape = COMPONENT_SHAPES[type] ?? "x";
  const center = cellSize / 2;
  const shapeSize = cellSize * 0.65;

  switch (shape) {
    case "square":
      return (
        <Rect
          x={x + center - shapeSize / 2}
          y={y + center - shapeSize / 2}
          width={shapeSize}
          height={shapeSize}
          fill={color}
          opacity={opacity}
          listening={listening}
        />
      );
    case "circle":
      return (
        <Circle
          x={x + center}
          y={y + center}
          radius={shapeSize / 2}
          fill={color}
          opacity={opacity}
          listening={listening}
        />
      );
    case "x":
      return (
        <Group listening={listening}>
          <Rect
            x={x + center - shapeSize / 2}
            y={y + center - shapeSize / 2}
            width={shapeSize}
            height={shapeSize}
            fill={color}
            opacity={opacity}
          />
          <Line
            points={[
              x + center - shapeSize / 3,
              y + center - shapeSize / 3,
              x + center + shapeSize / 3,
              y + center + shapeSize / 3,
            ]}
            stroke="#666"
            strokeWidth={2}
            opacity={opacity}
          />
          <Line
            points={[
              x + center + shapeSize / 3,
              y + center - shapeSize / 3,
              x + center - shapeSize / 3,
              y + center + shapeSize / 3,
            ]}
            stroke="#666"
            strokeWidth={2}
            opacity={opacity}
          />
        </Group>
      );
    default:
      return null;
  }
}

export const ComponentShape = memo(ComponentShapeComponent);
