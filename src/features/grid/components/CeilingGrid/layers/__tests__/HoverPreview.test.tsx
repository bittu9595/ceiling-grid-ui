import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HoverPreview } from "../HoverPreview";
import type { ToolType, ComponentType } from "../../../../../../types";

// Mock react-konva
vi.mock("react-konva", () => ({
  Rect: ({
    x,
    y,
    width,
    height,
    fill,
    stroke,
    strokeWidth,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
  }) => (
    <div
      data-testid="rect"
      data-x={x}
      data-y={y}
      data-width={width}
      data-height={height}
      data-fill={fill}
      data-stroke={stroke}
      data-stroke-width={strokeWidth}
    />
  ),
  Circle: ({
    x,
    y,
    radius,
    fill,
    opacity,
  }: {
    x: number;
    y: number;
    radius: number;
    fill: string;
    opacity: number;
  }) => (
    <div
      data-testid="circle"
      data-x={x}
      data-y={y}
      data-radius={radius}
      data-fill={fill}
      data-opacity={opacity}
    />
  ),
  Group: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="group">{children}</div>
  ),
  Line: ({ points }: { points: number[] }) => (
    <div data-testid="line" data-points={points.join(",")} />
  ),
}));

// Mock hooks
const mockTheme = {
  hoverFill: "rgba(0, 0, 0, 0.05)",
  selectColor: "#3b82f6",
  panColor: "#10b981",
  eraserColor: "#ef4444",
};

vi.mock("../../../../hooks", () => ({
  useCanvasTheme: () => mockTheme,
}));

// Mock constants
vi.mock("../../../../constants", () => ({
  COMPONENT_COLORS: {
    diffuser: "#3b82f6",
    vent: "#10b981",
    light: "#f59e0b",
    sprinkler: "#ef4444",
  },
  COMPONENT_SHAPES: {
    diffuser: "square",
    vent: "circle",
    light: "square",
    sprinkler: "x",
  },
}));

vi.mock("../../../../../../constants/ceiling-components", () => ({
  TOOL_TYPES: {
    SELECT: "select",
    PAN: "pan",
    ERASER: "eraser",
  },
}));

// Mock ComponentShape
vi.mock("../ComponentShape", () => ({
  ComponentShape: ({
    type,
    x,
    y,
    cellSize,
    opacity,
  }: {
    type: ComponentType;
    x: number;
    y: number;
    cellSize: number;
    opacity: number;
  }) => (
    <div
      data-testid="component-shape"
      data-type={type}
      data-x={x}
      data-y={y}
      data-cell-size={cellSize}
      data-opacity={opacity}
    />
  ),
}));

describe("HoverPreview", () => {
  const defaultProps = {
    row: 2,
    col: 3,
    offsetX: 50,
    offsetY: 50,
    cellSize: 40,
    selectedTool: "select" as ToolType,
  };

  describe("rendering", () => {
    it("renders hover border rect", () => {
      const { getByTestId } = render(<HoverPreview {...defaultProps} />);
      expect(getByTestId("rect")).toBeInTheDocument();
    });
  });

  describe("positioning", () => {
    it("calculates correct x position with padding", () => {
      const { getByTestId } = render(<HoverPreview {...defaultProps} />);
      // offsetX (50) + col (3) * cellSize (40) + padding (2) = 172
      expect(getByTestId("rect")).toHaveAttribute("data-x", "172");
    });

    it("calculates correct y position with padding", () => {
      const { getByTestId } = render(<HoverPreview {...defaultProps} />);
      // offsetY (50) + row (2) * cellSize (40) + padding (2) = 132
      expect(getByTestId("rect")).toHaveAttribute("data-y", "132");
    });

    it("calculates correct width with padding", () => {
      const { getByTestId } = render(<HoverPreview {...defaultProps} />);
      // cellSize (40) - padding (4) = 36
      expect(getByTestId("rect")).toHaveAttribute("data-width", "36");
    });

    it("calculates correct height with padding", () => {
      const { getByTestId } = render(<HoverPreview {...defaultProps} />);
      // cellSize (40) - padding (4) = 36
      expect(getByTestId("rect")).toHaveAttribute("data-height", "36");
    });
  });

  describe("tool-based border colors", () => {
    it("uses select color for select tool", () => {
      const props = { ...defaultProps, selectedTool: "select" as ToolType };
      const { getByTestId } = render(<HoverPreview {...props} />);
      expect(getByTestId("rect")).toHaveAttribute("data-stroke", "#3b82f6");
    });

    it("uses pan color for pan tool", () => {
      const props = { ...defaultProps, selectedTool: "pan" as ToolType };
      const { getByTestId } = render(<HoverPreview {...props} />);
      expect(getByTestId("rect")).toHaveAttribute("data-stroke", "#10b981");
    });

    it("uses eraser color for eraser tool", () => {
      const props = { ...defaultProps, selectedTool: "eraser" as ToolType };
      const { getByTestId } = render(<HoverPreview {...props} />);
      expect(getByTestId("rect")).toHaveAttribute("data-stroke", "#ef4444");
    });

    it("uses component color for placement tool", () => {
      const props = { ...defaultProps, selectedTool: "diffuser" as ToolType };
      const { getByTestId } = render(<HoverPreview {...props} />);
      expect(getByTestId("rect")).toHaveAttribute("data-stroke", "#3b82f6");
    });
  });

  describe("component preview", () => {
    it("does not show component shape for select tool", () => {
      const props = { ...defaultProps, selectedTool: "select" as ToolType };
      const { queryByTestId } = render(<HoverPreview {...props} />);
      expect(queryByTestId("component-shape")).not.toBeInTheDocument();
    });

    it("does not show component shape for pan tool", () => {
      const props = { ...defaultProps, selectedTool: "pan" as ToolType };
      const { queryByTestId } = render(<HoverPreview {...props} />);
      expect(queryByTestId("component-shape")).not.toBeInTheDocument();
    });

    it("does not show component shape for eraser tool", () => {
      const props = { ...defaultProps, selectedTool: "eraser" as ToolType };
      const { queryByTestId } = render(<HoverPreview {...props} />);
      expect(queryByTestId("component-shape")).not.toBeInTheDocument();
    });

    it("shows component shape for placement tool", () => {
      const props = { ...defaultProps, selectedTool: "diffuser" as ToolType };
      const { getByTestId } = render(<HoverPreview {...props} />);
      expect(getByTestId("component-shape")).toBeInTheDocument();
    });

    it("passes correct type to component shape", () => {
      const props = { ...defaultProps, selectedTool: "vent" as ToolType };
      const { getByTestId } = render(<HoverPreview {...props} />);
      expect(getByTestId("component-shape")).toHaveAttribute(
        "data-type",
        "vent",
      );
    });

    it("component shape has 0.5 opacity", () => {
      const props = { ...defaultProps, selectedTool: "diffuser" as ToolType };
      const { getByTestId } = render(<HoverPreview {...props} />);
      expect(getByTestId("component-shape")).toHaveAttribute(
        "data-opacity",
        "0.5",
      );
    });
  });

  describe("theming", () => {
    it("uses theme hover fill color", () => {
      const { getByTestId } = render(<HoverPreview {...defaultProps} />);
      expect(getByTestId("rect")).toHaveAttribute(
        "data-fill",
        "rgba(0, 0, 0, 0.05)",
      );
    });

    it("has stroke width of 2", () => {
      const { getByTestId } = render(<HoverPreview {...defaultProps} />);
      expect(getByTestId("rect")).toHaveAttribute("data-stroke-width", "2");
    });
  });
});
