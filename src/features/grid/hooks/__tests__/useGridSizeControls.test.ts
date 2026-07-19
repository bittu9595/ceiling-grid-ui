import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGridSizeControls } from "../useGridSizeControls";

// Mock store values
const mockGrid = vi.fn();
const mockSetGridSize = vi.fn();
const mockResetZoom = vi.fn();

vi.mock("../../../../store", () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    selector({
      grid: mockGrid(),
      setGridSize: mockSetGridSize,
      resetZoom: mockResetZoom,
    }),
}));

describe("useGridSizeControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGrid.mockReturnValue({ width: 20, height: 15 });
  });

  describe("initial state", () => {
    it("initializes customWidth from grid width", () => {
      mockGrid.mockReturnValue({ width: 25, height: 20 });
      const { result } = renderHook(() => useGridSizeControls());

      expect(result.current.customWidth).toBe("25");
    });

    it("initializes customHeight from grid height", () => {
      mockGrid.mockReturnValue({ width: 25, height: 20 });
      const { result } = renderHook(() => useGridSizeControls());

      expect(result.current.customHeight).toBe("20");
    });
  });

  describe("setCustomWidth", () => {
    it("updates customWidth value", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomWidth("30");
      });

      expect(result.current.customWidth).toBe("30");
    });
  });

  describe("setCustomHeight", () => {
    it("updates customHeight value", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomHeight("25");
      });

      expect(result.current.customHeight).toBe("25");
    });
  });

  describe("handlePresetSelect", () => {
    it("parses preset value and sets grid size", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.handlePresetSelect("30x20");
      });

      expect(mockSetGridSize).toHaveBeenCalledWith(30, 20);
    });

    it("updates custom inputs to match preset", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.handlePresetSelect("40x30");
      });

      expect(result.current.customWidth).toBe("40");
      expect(result.current.customHeight).toBe("30");
    });

    it("resets zoom after preset selection", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.handlePresetSelect("30x20");
      });

      expect(mockResetZoom).toHaveBeenCalled();
    });
  });

  describe("handleCustomSize", () => {
    it("sets grid size from custom inputs", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomWidth("35");
        result.current.setCustomHeight("25");
      });

      act(() => {
        result.current.handleCustomSize();
      });

      expect(mockSetGridSize).toHaveBeenCalledWith(35, 25);
    });

    it("resets zoom after custom size", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.handleCustomSize();
      });

      expect(mockResetZoom).toHaveBeenCalled();
    });

    it("clamps width to minimum of 1", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomWidth("-5");
        result.current.setCustomHeight("10");
      });

      act(() => {
        result.current.handleCustomSize();
      });

      expect(mockSetGridSize).toHaveBeenCalledWith(1, 10);
    });

    it("clamps width to maximum of 2000", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomWidth("3000");
        result.current.setCustomHeight("10");
      });

      act(() => {
        result.current.handleCustomSize();
      });

      expect(mockSetGridSize).toHaveBeenCalledWith(2000, 10);
    });

    it("uses default width of 20 for invalid input", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomWidth("abc");
        result.current.setCustomHeight("10");
      });

      act(() => {
        result.current.handleCustomSize();
      });

      expect(mockSetGridSize).toHaveBeenCalledWith(20, 10);
    });

    it("uses default height of 15 for invalid input", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomWidth("10");
        result.current.setCustomHeight("xyz");
      });

      act(() => {
        result.current.handleCustomSize();
      });

      expect(mockSetGridSize).toHaveBeenCalledWith(10, 15);
    });
  });

  describe("handleKeyDown", () => {
    it("calls handleCustomSize on Enter key", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.setCustomWidth("30");
        result.current.setCustomHeight("20");
      });

      act(() => {
        result.current.handleKeyDown({
          key: "Enter",
        } as React.KeyboardEvent);
      });

      expect(mockSetGridSize).toHaveBeenCalledWith(30, 20);
    });

    it("does not call handleCustomSize on other keys", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.handleKeyDown({ key: "Tab" } as React.KeyboardEvent);
      });

      expect(mockSetGridSize).not.toHaveBeenCalled();
    });

    it("does not call handleCustomSize on Escape key", () => {
      const { result } = renderHook(() => useGridSizeControls());

      act(() => {
        result.current.handleKeyDown({
          key: "Escape",
        } as React.KeyboardEvent);
      });

      expect(mockSetGridSize).not.toHaveBeenCalled();
    });
  });
});
