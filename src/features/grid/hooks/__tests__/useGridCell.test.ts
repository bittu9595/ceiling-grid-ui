import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGridCell } from "../useGridCell";
import type { GridComponent } from "../../../../types";

describe("useGridCell", () => {
  const mockOnSelect = vi.fn();
  const mockOnDragStart = vi.fn();
  const mockOnDragEnd = vi.fn();

  const defaultComponent: GridComponent = {
    id: "comp-1",
    type: "light",
    position: { row: 2, col: 3 },
  };

  const defaultProps = {
    component: defaultComponent,
    offsetX: 100,
    offsetY: 50,
    cellSize: 40,
    onSelect: mockOnSelect,
    onDragStart: mockOnDragStart,
    onDragEnd: mockOnDragEnd,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("position calculation", () => {
    it("calculates xPoint correctly", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      // offsetX + col * cellSize = 100 + 3 * 40 = 220
      expect(result.current.xPoint).toBe(220);
    });

    it("calculates yPoint correctly", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      // offsetY + row * cellSize = 50 + 2 * 40 = 130
      expect(result.current.yPoint).toBe(130);
    });

    it("handles zero offset", () => {
      const props = { ...defaultProps, offsetX: 0, offsetY: 0 };
      const { result } = renderHook(() => useGridCell(props));

      // col * cellSize = 3 * 40 = 120
      expect(result.current.xPoint).toBe(120);
      // row * cellSize = 2 * 40 = 80
      expect(result.current.yPoint).toBe(80);
    });

    it("handles different cell sizes", () => {
      const props = { ...defaultProps, cellSize: 60 };
      const { result } = renderHook(() => useGridCell(props));

      // 100 + 3 * 60 = 280
      expect(result.current.xPoint).toBe(280);
      // 50 + 2 * 60 = 170
      expect(result.current.yPoint).toBe(170);
    });
  });

  describe("handleClick", () => {
    it("calls onSelect with component", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      const mockEvent = { cancelBubble: false };
      result.current.handleClick(mockEvent);

      expect(mockOnSelect).toHaveBeenCalledWith(defaultComponent);
    });

    it("sets cancelBubble to true", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      const mockEvent = { cancelBubble: false };
      result.current.handleClick(mockEvent);

      expect(mockEvent.cancelBubble).toBe(true);
    });
  });

  describe("handleDragStart", () => {
    it("calls onDragStart with component", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      const mockEvent = { cancelBubble: false };
      result.current.handleDragStart(mockEvent);

      expect(mockOnDragStart).toHaveBeenCalledWith(defaultComponent);
    });

    it("sets cancelBubble to true", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      const mockEvent = { cancelBubble: false };
      result.current.handleDragStart(mockEvent);

      expect(mockEvent.cancelBubble).toBe(true);
    });
  });

  describe("handleDragEnd", () => {
    it("calculates new position and calls onDragEnd", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      const mockPosition = vi.fn();
      const mockEvent = {
        cancelBubble: false,
        target: {
          x: () => 260, // offsetX (100) + col (4) * cellSize (40) = 260
          y: () => 170, // offsetY (50) + row (3) * cellSize (40) = 170
          position: mockPosition,
        },
      };

      result.current.handleDragEnd(mockEvent);

      expect(mockOnDragEnd).toHaveBeenCalledWith(3, 4);
    });

    it("snaps position to grid", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      const mockPosition = vi.fn();
      const mockEvent = {
        cancelBubble: false,
        target: {
          x: () => 260,
          y: () => 170,
          position: mockPosition,
        },
      };

      result.current.handleDragEnd(mockEvent);

      expect(mockPosition).toHaveBeenCalledWith({ x: 260, y: 170 });
    });

    it("sets cancelBubble to true", () => {
      const { result } = renderHook(() => useGridCell(defaultProps));

      const mockEvent = {
        cancelBubble: false,
        target: {
          x: () => 260,
          y: () => 170,
          position: vi.fn(),
        },
      };

      result.current.handleDragEnd(mockEvent);

      expect(mockEvent.cancelBubble).toBe(true);
    });
  });

  describe("callback stability", () => {
    it("handleClick is stable when dependencies do not change", () => {
      const { result, rerender } = renderHook(() => useGridCell(defaultProps));

      const firstHandleClick = result.current.handleClick;
      rerender();
      const secondHandleClick = result.current.handleClick;

      expect(firstHandleClick).toBe(secondHandleClick);
    });

    it("handleDragStart is stable when dependencies do not change", () => {
      const { result, rerender } = renderHook(() => useGridCell(defaultProps));

      const firstHandler = result.current.handleDragStart;
      rerender();
      const secondHandler = result.current.handleDragStart;

      expect(firstHandler).toBe(secondHandler);
    });

    it("handleDragEnd is stable when dependencies do not change", () => {
      const { result, rerender } = renderHook(() => useGridCell(defaultProps));

      const firstHandler = result.current.handleDragEnd;
      rerender();
      const secondHandler = result.current.handleDragEnd;

      expect(firstHandler).toBe(secondHandler);
    });
  });
});
