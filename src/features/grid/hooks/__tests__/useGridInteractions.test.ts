import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGridInteractions } from "../useGridInteractions";

// Mock store values
const mockGrid = vi.fn();
const mockViewport = vi.fn();
const mockSelectedTool = vi.fn();
const mockAddComponent = vi.fn();
const mockRemoveComponent = vi.fn();
const mockMoveComponent = vi.fn();
const mockSelectComponent = vi.fn();
const mockSetOffset = vi.fn();

vi.mock("../../../../store", () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    selector({
      grid: mockGrid(),
      viewport: mockViewport(),
      ui: { selectedTool: mockSelectedTool() },
      addComponent: mockAddComponent,
      removeComponent: mockRemoveComponent,
      moveComponent: mockMoveComponent,
      selectComponent: mockSelectComponent,
      setOffset: mockSetOffset,
    }),
}));

vi.mock("../../../../constants/ceiling-components", () => ({
  TOOL_TYPES: {
    SELECT: "select",
    PAN: "pan",
    ERASER: "eraser",
  },
}));

describe("useGridInteractions", () => {
  const defaultGrid = {
    width: 10,
    height: 10,
    components: {},
  };

  const defaultViewport = {
    offsetX: 100,
    offsetY: 50,
    zoom: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGrid.mockReturnValue(defaultGrid);
    mockViewport.mockReturnValue(defaultViewport);
    mockSelectedTool.mockReturnValue("select");
  });

  describe("hover cell tracking", () => {
    it("starts with null hover cell", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      expect(result.current.hoverCell).toBeNull();
    });

    it("updates hover cell on mouse move within grid", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      act(() => {
        result.current.handleStageMouseMove({
          evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
        });
      });

      // (150 - 100) / 40 = 1.25 -> col 1
      // (100 - 50) / 40 = 1.25 -> row 1
      expect(result.current.hoverCell).toEqual({ row: 1, col: 1 });
    });

    it("sets hover cell to null when outside grid bounds", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      act(() => {
        // First move inside grid
        result.current.handleStageMouseMove({
          evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
        });
      });

      act(() => {
        // Then move outside grid (negative)
        result.current.handleStageMouseMove({
          evt: { offsetX: 50, offsetY: 30 } as MouseEvent,
        });
      });

      expect(result.current.hoverCell).toBeNull();
    });

    it("clears hover cell on mouse leave", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      act(() => {
        result.current.handleStageMouseMove({
          evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
        });
      });

      act(() => {
        result.current.handleStageMouseLeave();
      });

      expect(result.current.hoverCell).toBeNull();
    });
  });

  describe("stage click handling", () => {
    it("does nothing when clicking on a shape", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const mockStage = {};
      const mockEvent = {
        target: { getStage: () => mockStage },
        evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
      };
      // Target is not the stage
      mockEvent.target = {
        getStage: () => mockStage,
      } as unknown as typeof mockEvent.target;

      act(() => {
        result.current.handleStageClick(mockEvent);
      });

      expect(mockAddComponent).not.toHaveBeenCalled();
      expect(mockRemoveComponent).not.toHaveBeenCalled();
      expect(mockSelectComponent).not.toHaveBeenCalled();
    });

    it("selects null when clicking empty cell with select tool", () => {
      mockSelectedTool.mockReturnValue("select");
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const mockStage = { getStage: () => mockStage };
      const mockEvent = {
        target: mockStage,
        evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
      };

      act(() => {
        result.current.handleStageClick(mockEvent);
      });

      expect(mockSelectComponent).toHaveBeenCalledWith(null);
    });

    it("removes component when clicking with eraser tool", () => {
      mockSelectedTool.mockReturnValue("eraser");
      mockGrid.mockReturnValue({
        ...defaultGrid,
        components: {
          "1-1": {
            id: "1",
            type: "light" as const,
            position: { row: 1, col: 1 },
          },
        },
      });

      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const mockStage = { getStage: () => mockStage };
      const mockEvent = {
        target: mockStage,
        evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
      };

      act(() => {
        result.current.handleStageClick(mockEvent);
      });

      expect(mockRemoveComponent).toHaveBeenCalledWith({ row: 1, col: 1 });
    });

    it("adds component when clicking empty cell with placement tool", () => {
      mockSelectedTool.mockReturnValue("light");
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const mockStage = { getStage: () => mockStage };
      const mockEvent = {
        target: mockStage,
        evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
      };

      act(() => {
        result.current.handleStageClick(mockEvent);
      });

      expect(mockAddComponent).toHaveBeenCalledWith("light", {
        row: 1,
        col: 1,
      });
    });

    it("does not add component if cell is occupied", () => {
      mockSelectedTool.mockReturnValue("light");
      mockGrid.mockReturnValue({
        ...defaultGrid,
        components: {
          "1-1": {
            id: "1",
            type: "air-supply" as const,
            position: { row: 1, col: 1 },
          },
        },
      });

      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const mockStage = { getStage: () => mockStage };
      const mockEvent = {
        target: mockStage,
        evt: { offsetX: 150, offsetY: 100 } as MouseEvent,
      };

      act(() => {
        result.current.handleStageClick(mockEvent);
      });

      expect(mockAddComponent).not.toHaveBeenCalled();
    });
  });

  describe("cell interactions", () => {
    it("selects component on cell select with select tool", () => {
      mockSelectedTool.mockReturnValue("select");
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const component = {
        id: "1",
        type: "light" as const,
        position: { row: 0, col: 0 },
      };
      act(() => {
        result.current.handleCellSelect(component);
      });

      expect(mockSelectComponent).toHaveBeenCalledWith(component);
    });

    it("removes component on cell select with eraser tool", () => {
      mockSelectedTool.mockReturnValue("eraser");
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const component = {
        id: "1",
        type: "light" as const,
        position: { row: 2, col: 3 },
      };
      act(() => {
        result.current.handleCellSelect(component);
      });

      expect(mockRemoveComponent).toHaveBeenCalledWith({ row: 2, col: 3 });
    });
  });

  describe("drag handling", () => {
    it("tracks drag target on drag start", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const component = {
        id: "1",
        type: "light" as const,
        position: { row: 0, col: 0 },
      };
      act(() => {
        result.current.handleCellDragStart(component);
      });

      expect(result.current.dragTarget).toEqual(component);
    });

    it("moves component on drag end", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const component = {
        id: "1",
        type: "light" as const,
        position: { row: 0, col: 0 },
      };

      act(() => {
        result.current.handleCellDragStart(component);
      });

      act(() => {
        result.current.handleCellDragEnd(2, 3);
      });

      expect(mockMoveComponent).toHaveBeenCalledWith(
        { row: 0, col: 0 },
        { row: 2, col: 3 },
      );
    });

    it("clamps position to grid bounds on drag end", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const component = {
        id: "1",
        type: "light" as const,
        position: { row: 0, col: 0 },
      };

      act(() => {
        result.current.handleCellDragStart(component);
      });

      act(() => {
        // Try to drag outside bounds
        result.current.handleCellDragEnd(100, 100);
      });

      // Should clamp to max bounds (9, 9) for 10x10 grid
      expect(mockMoveComponent).toHaveBeenCalledWith(
        { row: 0, col: 0 },
        { row: 9, col: 9 },
      );
    });

    it("clears drag target after drag end", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const component = {
        id: "1",
        type: "light" as const,
        position: { row: 0, col: 0 },
      };

      act(() => {
        result.current.handleCellDragStart(component);
      });

      act(() => {
        result.current.handleCellDragEnd(2, 3);
      });

      expect(result.current.dragTarget).toBeNull();
    });
  });

  describe("stage drag (pan)", () => {
    it("updates offset on stage drag end", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const mockPosition = vi.fn();
      const mockEvent = {
        target: {
          x: () => 50,
          y: () => 30,
          position: mockPosition,
        },
      };

      act(() => {
        result.current.handleStageDragEnd(mockEvent);
      });

      // New offset = current offset + drag delta
      // (100 + 50, 50 + 30) = (150, 80)
      expect(mockSetOffset).toHaveBeenCalledWith(150, 80);
    });

    it("resets stage position after drag", () => {
      const { result } = renderHook(() =>
        useGridInteractions({ cellSize: 40 }),
      );

      const mockPosition = vi.fn();
      const mockEvent = {
        target: {
          x: () => 50,
          y: () => 30,
          position: mockPosition,
        },
      };

      act(() => {
        result.current.handleStageDragEnd(mockEvent);
      });

      expect(mockPosition).toHaveBeenCalledWith({ x: 0, y: 0 });
    });
  });
});
