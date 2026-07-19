import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCanvasTheme } from "../useCanvasTheme";

// Mock the store
const mockTheme = vi.fn();

vi.mock("../../../../store", () => ({
  useAppStore: (selector: (state: { ui: { theme: string } }) => string) =>
    selector({ ui: { theme: mockTheme() } }),
}));

describe("useCanvasTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme.mockReturnValue("light");
  });

  describe("light theme", () => {
    it("returns light theme colors when theme is light", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.canvasBg).toBe("#e2e8f0");
      expect(result.current.gridAreaBg).toBe("#f5f3ed");
    });

    it("returns correct grid line color for light theme", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.gridLine).toBe("#94a3b8");
    });

    it("returns correct hover fill for light theme", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.hoverFill).toBe("rgba(0,0,0,0.04)");
    });

    it("returns correct select color", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.selectColor).toBe("#3b82f6");
    });

    it("returns correct pan color", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.panColor).toBe("#64748b");
    });

    it("returns correct eraser color", () => {
      mockTheme.mockReturnValue("light");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.eraserColor).toBe("#ef4444");
    });
  });

  describe("dark theme", () => {
    it("returns dark theme canvas background when theme is dark", () => {
      mockTheme.mockReturnValue("dark");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.canvasBg).toBe("#0f172a");
    });

    it("keeps same grid area background in dark theme", () => {
      mockTheme.mockReturnValue("dark");
      const { result } = renderHook(() => useCanvasTheme());

      // Grid area remains cream colored in both themes
      expect(result.current.gridAreaBg).toBe("#f5f3ed");
    });

    it("returns correct tool colors in dark theme", () => {
      mockTheme.mockReturnValue("dark");
      const { result } = renderHook(() => useCanvasTheme());

      expect(result.current.selectColor).toBe("#3b82f6");
      expect(result.current.panColor).toBe("#64748b");
      expect(result.current.eraserColor).toBe("#ef4444");
    });
  });

  describe("memoization", () => {
    it("returns same object reference when theme does not change", () => {
      mockTheme.mockReturnValue("light");
      const { result, rerender } = renderHook(() => useCanvasTheme());

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });
});
