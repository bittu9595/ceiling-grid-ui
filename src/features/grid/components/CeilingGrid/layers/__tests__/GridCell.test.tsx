import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GridCell } from "../GridCell";
import type { GridComponent, ComponentType } from "../../../../../../types";

// Mock react-konva
vi.mock("react-konva", () => ({
  Group: ({
    children,
    x,
    y,
    draggable,
    onClick,
    onTap,
    onDragStart,
    onDragEnd,
  }: {
    children: React.ReactNode;
    x: number;
    y: number;
    draggable: boolean;
    onClick: () => void;
    onTap: () => void;
    onDragStart: () => void;
    onDragEnd: (e: unknown) => void;
  }) => (
    <div
      data-testid="group"
      data-x={x}
      data-y={y}
      data-draggable={draggable}
      onClick={onClick}
      onTouchEnd={onTap}
      onDragStart={onDragStart}
      onDragEnd={(e) => onDragEnd(e)}
    >
      {children}
    </div>
  ),
  Rect: ({
    x,
    y,
    width,
    height,
    stroke,
    strokeWidth,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke: string;
    strokeWidth: number;
  }) => (
    <div
      data-testid="selection-rect"
      data-x={x}
      data-y={y}
      data-width={width}
      data-height={height}
      data-stroke={stroke}
      data-stroke-width={strokeWidth}
    />
  ),
  Line: ({ points }: { points: number[] }) => (
    <div data-testid="line" data-points={points.join(",")} />
  ),
  Circle: ({ x, y, radius }: { x: number; y: number; radius: number }) => (
    <div data-testid="circle" data-x={x} data-y={y} data-radius={radius} />
  ),
}));

// Mock ComponentShape to avoid deep dependency on konva shapes
vi.mock("../ComponentShape", () => ({
  ComponentShape: ({ type }: { type: string }) => (
    <div data-testid="component-shape" data-type={type} />
  ),
}));

// Mock hooks
const mockTheme = {
  selectColor: "#3b82f6",
};

vi.mock("../../../../hooks", () => ({
  useCanvasTheme: () => mockTheme,
  useGridCell: ({
    component,
    offsetX,
    offsetY,
    cellSize,
    onSelect,
    onDragStart,
    onDragEnd,
  }: {
    component: GridComponent;
    offsetX: number;
    offsetY: number;
    cellSize: number;
    onSelect: (comp: GridComponent) => void;
    onDragStart: (comp: GridComponent) => void;
    onDragEnd: (row: number, col: number) => void;
  }) => ({
    xPoint: offsetX + component.position.col * cellSize,
    yPoint: offsetY + component.position.row * cellSize,
    handleClick: () => onSelect(component),
    handleDragStart: () => onDragStart(component),
    handleDragEnd: () =>
      onDragEnd(component.position.row, component.position.col),
  }),
}));

// Mock ComponentShape
vi.mock("./ComponentShape", () => ({
  ComponentShape: ({
    type,
    x,
    y,
    cellSize,
  }: {
    type: ComponentType;
    x: number;
    y: number;
    cellSize: number;
  }) => (
    <div
      data-testid="component-shape"
      data-type={type}
      data-x={x}
      data-y={y}
      data-cell-size={cellSize}
    />
  ),
}));

describe("GridCell", () => {
  const mockComponent: GridComponent = {
    id: "test-123",
    type: "diffuser" as ComponentType,
    position: { row: 2, col: 3 },
  };

  const defaultProps = {
    component: mockComponent,
    offsetX: 50,
    offsetY: 50,
    cellSize: 40,
    isSelected: false,
    onSelect: vi.fn(),
    onDragStart: vi.fn(),
    onDragEnd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a Group component", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      expect(getByTestId("group")).toBeInTheDocument();
    });

    it("renders ComponentShape", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      expect(getByTestId("component-shape")).toBeInTheDocument();
    });

    it("passes correct type to ComponentShape", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      expect(getByTestId("component-shape")).toHaveAttribute(
        "data-type",
        "diffuser",
      );
    });
  });

  describe("positioning", () => {
    it("calculates correct x position", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      // offsetX (50) + col (3) * cellSize (40) = 170
      expect(getByTestId("group")).toHaveAttribute("data-x", "170");
    });

    it("calculates correct y position", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      // offsetY (50) + row (2) * cellSize (40) = 130
      expect(getByTestId("group")).toHaveAttribute("data-y", "130");
    });

    it("is draggable", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      expect(getByTestId("group")).toHaveAttribute("data-draggable", "true");
    });
  });

  describe("selection", () => {
    it("does not render selection rect when not selected", () => {
      const { queryByTestId } = render(<GridCell {...defaultProps} />);
      expect(queryByTestId("selection-rect")).not.toBeInTheDocument();
    });

    it("renders selection rect when selected", () => {
      const props = { ...defaultProps, isSelected: true };
      const { getByTestId } = render(<GridCell {...props} />);
      expect(getByTestId("selection-rect")).toBeInTheDocument();
    });

    it("selection rect has correct dimensions", () => {
      const props = { ...defaultProps, isSelected: true };
      const { getByTestId } = render(<GridCell {...props} />);
      const rect = getByTestId("selection-rect");

      expect(rect).toHaveAttribute("data-width", "40");
      expect(rect).toHaveAttribute("data-height", "40");
    });

    it("selection rect uses theme color", () => {
      const props = { ...defaultProps, isSelected: true };
      const { getByTestId } = render(<GridCell {...props} />);
      const rect = getByTestId("selection-rect");

      expect(rect).toHaveAttribute("data-stroke", "#3b82f6");
    });
  });

  describe("interactions", () => {
    it("calls onSelect when clicked", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      fireEvent.click(getByTestId("group"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith(mockComponent);
    });

    it("calls onDragStart when drag starts", () => {
      const { getByTestId } = render(<GridCell {...defaultProps} />);
      fireEvent.dragStart(getByTestId("group"));
      expect(defaultProps.onDragStart).toHaveBeenCalledWith(mockComponent);
    });
  });

  describe("different component types", () => {
    it("renders vent component type", () => {
      const ventComponent = { ...mockComponent, type: "vent" as ComponentType };
      const props = { ...defaultProps, component: ventComponent };
      const { getByTestId } = render(<GridCell {...props} />);
      expect(getByTestId("component-shape")).toHaveAttribute(
        "data-type",
        "vent",
      );
    });

    it("renders light component type", () => {
      const lightComponent = {
        ...mockComponent,
        type: "light" as ComponentType,
      };
      const props = { ...defaultProps, component: lightComponent };
      const { getByTestId } = render(<GridCell {...props} />);
      expect(getByTestId("component-shape")).toHaveAttribute(
        "data-type",
        "light",
      );
    });
  });
});
