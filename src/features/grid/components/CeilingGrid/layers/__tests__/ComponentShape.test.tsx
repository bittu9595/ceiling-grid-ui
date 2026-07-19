import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ComponentShape } from "../ComponentShape";
import type { ComponentType } from "../../../../../../types";

// Mock react-konva
vi.mock("react-konva", () => ({
  Rect: ({
    x,
    y,
    width,
    height,
    fill,
    opacity,
    listening,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    opacity: number;
    listening: boolean;
  }) => (
    <div
      data-testid="rect"
      data-x={x}
      data-y={y}
      data-width={width}
      data-height={height}
      data-fill={fill}
      data-opacity={opacity}
      data-listening={listening}
    />
  ),
  Circle: ({
    x,
    y,
    radius,
    fill,
    opacity,
    listening,
  }: {
    x: number;
    y: number;
    radius: number;
    fill: string;
    opacity: number;
    listening: boolean;
  }) => (
    <div
      data-testid="circle"
      data-x={x}
      data-y={y}
      data-radius={radius}
      data-fill={fill}
      data-opacity={opacity}
      data-listening={listening}
    />
  ),
  Line: ({ points, stroke }: { points: number[]; stroke: string }) => (
    <div
      data-testid="line"
      data-points={points.join(",")}
      data-stroke={stroke}
    />
  ),
  Group: ({
    children,
    listening,
  }: {
    children: React.ReactNode;
    listening: boolean;
  }) => (
    <div data-testid="group" data-listening={listening}>
      {children}
    </div>
  ),
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
    light: "circle",
    sprinkler: "x",
  },
}));

describe("ComponentShape", () => {
  const defaultProps = {
    type: "diffuser" as ComponentType,
    x: 100,
    y: 100,
    cellSize: 40,
  };

  describe("square shape (diffuser)", () => {
    it("renders a Rect for square shape", () => {
      const { getByTestId } = render(<ComponentShape {...defaultProps} />);
      expect(getByTestId("rect")).toBeInTheDocument();
    });

    it("uses correct color", () => {
      const { getByTestId } = render(<ComponentShape {...defaultProps} />);
      expect(getByTestId("rect")).toHaveAttribute("data-fill", "#3b82f6");
    });

    it("calculates correct position", () => {
      const { getByTestId } = render(<ComponentShape {...defaultProps} />);
      // x + center (20) - shapeSize/2 (13) = 107
      expect(getByTestId("rect")).toHaveAttribute("data-x", "107");
    });

    it("calculates correct size (65% of cellSize)", () => {
      const { getByTestId } = render(<ComponentShape {...defaultProps} />);
      // cellSize (40) * 0.65 = 26
      expect(getByTestId("rect")).toHaveAttribute("data-width", "26");
      expect(getByTestId("rect")).toHaveAttribute("data-height", "26");
    });
  });

  describe("circle shape (vent)", () => {
    it("renders a Circle for circle shape", () => {
      const props = { ...defaultProps, type: "vent" as ComponentType };
      const { getByTestId } = render(<ComponentShape {...props} />);
      expect(getByTestId("circle")).toBeInTheDocument();
    });

    it("uses correct color", () => {
      const props = { ...defaultProps, type: "vent" as ComponentType };
      const { getByTestId } = render(<ComponentShape {...props} />);
      expect(getByTestId("circle")).toHaveAttribute("data-fill", "#10b981");
    });

    it("calculates correct center position", () => {
      const props = { ...defaultProps, type: "vent" as ComponentType };
      const { getByTestId } = render(<ComponentShape {...props} />);
      // x + center (20) = 120
      expect(getByTestId("circle")).toHaveAttribute("data-x", "120");
      expect(getByTestId("circle")).toHaveAttribute("data-y", "120");
    });

    it("calculates correct radius", () => {
      const props = { ...defaultProps, type: "vent" as ComponentType };
      const { getByTestId } = render(<ComponentShape {...props} />);
      // (cellSize * 0.65) / 2 = 13
      expect(getByTestId("circle")).toHaveAttribute("data-radius", "13");
    });
  });

  describe("x shape (sprinkler)", () => {
    it("renders a Group with Rect and Lines for x shape", () => {
      const props = { ...defaultProps, type: "sprinkler" as ComponentType };
      const { getByTestId, getAllByTestId } = render(
        <ComponentShape {...props} />,
      );
      expect(getByTestId("group")).toBeInTheDocument();
      expect(getByTestId("rect")).toBeInTheDocument();
      expect(getAllByTestId("line")).toHaveLength(2);
    });

    it("uses correct color", () => {
      const props = { ...defaultProps, type: "sprinkler" as ComponentType };
      const { getByTestId } = render(<ComponentShape {...props} />);
      expect(getByTestId("rect")).toHaveAttribute("data-fill", "#ef4444");
    });
  });

  describe("opacity", () => {
    it("defaults to opacity 1", () => {
      const { getByTestId } = render(<ComponentShape {...defaultProps} />);
      expect(getByTestId("rect")).toHaveAttribute("data-opacity", "1");
    });

    it("accepts custom opacity", () => {
      const props = { ...defaultProps, opacity: 0.5 };
      const { getByTestId } = render(<ComponentShape {...props} />);
      expect(getByTestId("rect")).toHaveAttribute("data-opacity", "0.5");
    });
  });

  describe("listening", () => {
    it("defaults to listening true", () => {
      const { getByTestId } = render(<ComponentShape {...defaultProps} />);
      expect(getByTestId("rect")).toHaveAttribute("data-listening", "true");
    });

    it("accepts listening false", () => {
      const props = { ...defaultProps, listening: false };
      const { getByTestId } = render(<ComponentShape {...props} />);
      expect(getByTestId("rect")).toHaveAttribute("data-listening", "false");
    });
  });

  describe("different cell sizes", () => {
    it("scales correctly for larger cells", () => {
      const props = { ...defaultProps, cellSize: 80 };
      const { getByTestId } = render(<ComponentShape {...props} />);
      // shapeSize = 80 * 0.65 = 52
      expect(getByTestId("rect")).toHaveAttribute("data-width", "52");
    });

    it("scales correctly for smaller cells", () => {
      const props = { ...defaultProps, cellSize: 20 };
      const { getByTestId } = render(<ComponentShape {...props} />);
      // shapeSize = 20 * 0.65 = 13
      expect(getByTestId("rect")).toHaveAttribute("data-width", "13");
    });
  });

  describe("unknown type", () => {
    it("falls back to x shape with default gray color for unknown type", () => {
      const props = { ...defaultProps, type: "unknown" as ComponentType };
      const { getByTestId, getAllByTestId } = render(
        <ComponentShape {...props} />,
      );
      // Unknown types default to "x" shape with gray color
      expect(getByTestId("group")).toBeInTheDocument();
      expect(getByTestId("rect")).toHaveAttribute("data-fill", "#6b7280");
      expect(getAllByTestId("line")).toHaveLength(2);
    });
  });
});
