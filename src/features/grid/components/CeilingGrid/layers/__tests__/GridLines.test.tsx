import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GridLines } from "../GridLines";

// Mock react-konva
vi.mock("react-konva", () => ({
  Shape: ({ sceneFunc }: { sceneFunc: (ctx: unknown) => void }) => {
    // Create a mock context to capture drawing calls
    const mockContext = {
      strokeStyle: "",
      lineWidth: 0,
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    };

    const mockCtx = {
      _context: mockContext,
    };

    // Execute the scene function to test it
    sceneFunc(mockCtx);

    return (
      <div
        data-testid="shape"
        data-stroke-style={mockContext.strokeStyle}
        data-line-width={mockContext.lineWidth}
        data-begin-path-calls={mockContext.beginPath.mock.calls.length}
        data-stroke-calls={mockContext.stroke.mock.calls.length}
        data-move-to-calls={mockContext.moveTo.mock.calls.length}
        data-line-to-calls={mockContext.lineTo.mock.calls.length}
      />
    );
  },
}));

// Mock useCanvasTheme hook
const mockTheme = {
  gridLine: "#e5e7eb",
};

vi.mock("../../../../hooks", () => ({
  useCanvasTheme: () => mockTheme,
}));

describe("GridLines", () => {
  const defaultProps = {
    offsetX: 50,
    offsetY: 50,
    gridWidth: 10,
    gridHeight: 8,
    cellSize: 40,
  };

  describe("rendering", () => {
    it("renders a Shape component", () => {
      const { getByTestId } = render(<GridLines {...defaultProps} />);
      expect(getByTestId("shape")).toBeInTheDocument();
    });
  });

  describe("drawing context", () => {
    it("sets stroke style from theme", () => {
      const { getByTestId } = render(<GridLines {...defaultProps} />);
      expect(getByTestId("shape")).toHaveAttribute(
        "data-stroke-style",
        "#e5e7eb",
      );
    });

    it("sets line width to 1", () => {
      const { getByTestId } = render(<GridLines {...defaultProps} />);
      expect(getByTestId("shape")).toHaveAttribute("data-line-width", "1");
    });

    it("calls beginPath once", () => {
      const { getByTestId } = render(<GridLines {...defaultProps} />);
      expect(getByTestId("shape")).toHaveAttribute(
        "data-begin-path-calls",
        "1",
      );
    });

    it("calls stroke once", () => {
      const { getByTestId } = render(<GridLines {...defaultProps} />);
      expect(getByTestId("shape")).toHaveAttribute("data-stroke-calls", "1");
    });
  });

  describe("line drawing", () => {
    it("draws correct number of vertical lines", () => {
      // gridWidth + 1 = 11 vertical lines
      const { getByTestId } = render(<GridLines {...defaultProps} />);
      const shape = getByTestId("shape");

      // 11 vertical + 9 horizontal = 20 moveTo calls
      const moveToCount = parseInt(
        shape.getAttribute("data-move-to-calls") || "0",
      );
      expect(moveToCount).toBe(20);
    });

    it("draws correct number of horizontal lines", () => {
      // gridHeight + 1 = 9 horizontal lines
      const { getByTestId } = render(<GridLines {...defaultProps} />);
      const shape = getByTestId("shape");

      // Same number of lineTo calls as moveTo
      const lineToCount = parseInt(
        shape.getAttribute("data-line-to-calls") || "0",
      );
      expect(lineToCount).toBe(20);
    });

    it("handles different grid sizes", () => {
      const props = { ...defaultProps, gridWidth: 5, gridHeight: 5 };
      const { getByTestId } = render(<GridLines {...props} />);
      const shape = getByTestId("shape");

      // 6 vertical + 6 horizontal = 12 lines
      const moveToCount = parseInt(
        shape.getAttribute("data-move-to-calls") || "0",
      );
      expect(moveToCount).toBe(12);
    });
  });

  describe("grid calculation", () => {
    it("handles zero-sized grid", () => {
      const props = { ...defaultProps, gridWidth: 0, gridHeight: 0 };
      const { getByTestId } = render(<GridLines {...props} />);
      const shape = getByTestId("shape");

      // 1 vertical + 1 horizontal = 2 lines (edges)
      const moveToCount = parseInt(
        shape.getAttribute("data-move-to-calls") || "0",
      );
      expect(moveToCount).toBe(2);
    });

    it("handles single cell grid", () => {
      const props = { ...defaultProps, gridWidth: 1, gridHeight: 1 };
      const { getByTestId } = render(<GridLines {...props} />);
      const shape = getByTestId("shape");

      // 2 vertical + 2 horizontal = 4 lines
      const moveToCount = parseInt(
        shape.getAttribute("data-move-to-calls") || "0",
      );
      expect(moveToCount).toBe(4);
    });
  });
});
