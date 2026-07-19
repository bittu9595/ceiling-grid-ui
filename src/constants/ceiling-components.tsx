import { Lightbulb, Wind, Fan, AlertTriangle, Ban } from "lucide-react";
import type { ComponentType } from "../types";

/** Component configuration - single source of truth */
export interface ComponentConfig {
  readonly type: ComponentType;
  readonly label: string;
  readonly description: string;
  readonly color: string;
  readonly shape: "square" | "circle" | "x";
  readonly icon: React.ReactNode;
}

export const CEILING_COMPONENTS: readonly ComponentConfig[] = [
  {
    type: "light",
    label: "Light",
    description: "Click to place a light fixture",
    color: "#f7c948",
    shape: "square",
    icon: <Lightbulb size={20} />,
  },
  {
    type: "air-supply",
    label: "Air supply",
    description: "Click to place an air supply vent",
    color: "#52b6d4",
    shape: "circle",
    icon: <Wind size={20} />,
  },
  {
    type: "air-return",
    label: "Air return",
    description: "Click to place an air return vent",
    color: "#4ead5b",
    shape: "circle",
    icon: <Fan size={20} />,
  },
  {
    type: "smoke-detector",
    label: "Smoke detector",
    description: "Click to place a smoke detector",
    color: "#e74c3c",
    shape: "circle",
    icon: <AlertTriangle size={20} />,
  },
  {
    type: "invalid",
    label: "Invalid cell",
    description: "Mark cell as invalid/blocked",
    color: "#9e9e9e",
    shape: "x",
    icon: <Ban size={20} />,
  },
];

/** Tool type constants */
export const TOOL_TYPES = {
  SELECT: "select",
  ERASER: "eraser",
  PAN: "pan",
} as const;

/** Colors for each component type (derived) */
export const COMPONENT_COLORS: Record<ComponentType, string> =
  Object.fromEntries(
    CEILING_COMPONENTS.map((c) => [c.type, c.color]),
  ) as Record<ComponentType, string>;

/** Shape types for each component (derived) */
export const COMPONENT_SHAPES: Record<
  ComponentType,
  "square" | "circle" | "x"
> = Object.fromEntries(
  CEILING_COMPONENTS.map((c) => [c.type, c.shape]),
) as Record<ComponentType, "square" | "circle" | "x">;
