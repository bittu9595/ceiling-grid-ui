import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GridBackground } from "../GridBackground";

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
    stroke?: string;
    strokeWidth?: number;
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
}));

// Mock useCanvasTheme hook
const mockTheme = {
  canvasBg: "#f5f5f5",
  gridAreaBg: "#ffffff",
  gridAreaStroke: "#cccccc",
};

vi.mock("../../../../hooks", () => ({
  useCanvasTheme: () => mockTheme,
}));

describe("GridBackground", () => {
  const defaultProps = {
    width: 800,
    height: 600,
    offsetX: 50,
    offsetY: 50,
    gridWidth: 10,
    gridHeight: 8,
    cellSize: 40,
  };

  describe("rendering", () => {
    it("renders two Rect elements", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      expect(rects).toHaveLength(2);
    });

    it("renders canvas background at origin", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const canvasBg = rects[0];

      expect(canvasBg).toHaveAttribute("data-x", "0");
      expect(canvasBg).toHaveAttribute("data-y", "0");
    });

    it("renders canvas background with full dimensions", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const canvasBg = rects[0];

      expect(canvasBg).toHaveAttribute("data-width", "800");
      expect(canvasBg).toHaveAttribute("data-height", "600");
    });

    it("renders grid area at offset position", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      expect(gridArea).toHaveAttribute("data-x", "50");
      expect(gridArea).toHaveAttribute("data-y", "50");
    });
  });

  describe("grid area dimensions", () => {
    it("calculates grid area width from gridWidth and cellSize", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      // gridWidth (10) * cellSize (40) = 400
      expect(gridArea).toHaveAttribute("data-width", "400");
    });

    it("calculates grid area height from gridHeight and cellSize", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      // gridHeight (8) * cellSize (40) = 320
      expect(gridArea).toHaveAttribute("data-height", "320");
    });

    it("handles different cell sizes", () => {
      const props = { ...defaultProps, cellSize: 60 };
      const { getAllByTestId } = render(<GridBackground {...props} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      // gridWidth (10) * cellSize (60) = 600
      expect(gridArea).toHaveAttribute("data-width", "600");
      // gridHeight (8) * cellSize (60) = 480
      expect(gridArea).toHaveAttribute("data-height", "480");
    });
  });

  describe("theming", () => {
    it("applies canvas background color", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const canvasBg = rects[0];

      expect(canvasBg).toHaveAttribute("data-fill", "#f5f5f5");
    });

    it("applies grid area background color", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      expect(gridArea).toHaveAttribute("data-fill", "#ffffff");
    });

    it("applies grid area stroke color", () => {
      const { getAllByTestId } = render(<GridBackground {...defaultProps} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      expect(gridArea).toHaveAttribute("data-stroke", "#cccccc");
    });
  });

  describe("offset handling", () => {
    it("handles negative offsets", () => {
      const props = { ...defaultProps, offsetX: -100, offsetY: -50 };
      const { getAllByTestId } = render(<GridBackground {...props} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      expect(gridArea).toHaveAttribute("data-x", "-100");
      expect(gridArea).toHaveAttribute("data-y", "-50");
    });

    it("handles zero offsets", () => {
      const props = { ...defaultProps, offsetX: 0, offsetY: 0 };
      const { getAllByTestId } = render(<GridBackground {...props} />);
      const rects = getAllByTestId("rect");
      const gridArea = rects[1];

      expect(gridArea).toHaveAttribute("data-x", "0");
      expect(gridArea).toHaveAttribute("data-y", "0");
    });
  });
});
