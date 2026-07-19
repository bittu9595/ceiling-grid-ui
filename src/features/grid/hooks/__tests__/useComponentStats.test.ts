import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useComponentStats } from "../useComponentStats";
import type { GridComponent } from "../../../../types";

// Mock components
const mockComponents = vi.fn();

vi.mock("../../../../store", () => ({
  useAppStore: (
    selector: (state: {
      grid: { components: Record<string, GridComponent> };
    }) => Record<string, GridComponent>,
  ) => selector({ grid: { components: mockComponents() } }),
}));

vi.mock("../../../../constants/ceiling-components", () => ({
  CEILING_COMPONENTS: [
    { type: "diffuser" },
    { type: "vent" },
    { type: "light" },
    { type: "sprinkler" },
  ],
}));

describe("useComponentStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockComponents.mockReturnValue({});
  });

  describe("empty grid", () => {
    it("returns zero counts for all component types when grid is empty", () => {
      mockComponents.mockReturnValue({});
      const { result } = renderHook(() => useComponentStats());

      expect(result.current).toEqual({
        diffuser: 0,
        vent: 0,
        light: 0,
        sprinkler: 0,
      });
    });
  });

  describe("grid with components", () => {
    it("counts single component type correctly", () => {
      mockComponents.mockReturnValue({
        "0,0": { id: "1", type: "diffuser", position: { row: 0, col: 0 } },
        "0,1": { id: "2", type: "diffuser", position: { row: 0, col: 1 } },
      });

      const { result } = renderHook(() => useComponentStats());

      expect(result.current.diffuser).toBe(2);
      expect(result.current.vent).toBe(0);
    });

    it("counts multiple component types correctly", () => {
      mockComponents.mockReturnValue({
        "0,0": { id: "1", type: "diffuser", position: { row: 0, col: 0 } },
        "0,1": { id: "2", type: "vent", position: { row: 0, col: 1 } },
        "1,0": { id: "3", type: "light", position: { row: 1, col: 0 } },
        "1,1": { id: "4", type: "sprinkler", position: { row: 1, col: 1 } },
      });

      const { result } = renderHook(() => useComponentStats());

      expect(result.current).toEqual({
        diffuser: 1,
        vent: 1,
        light: 1,
        sprinkler: 1,
      });
    });

    it("handles multiple components of same type", () => {
      mockComponents.mockReturnValue({
        "0,0": { id: "1", type: "light", position: { row: 0, col: 0 } },
        "0,1": { id: "2", type: "light", position: { row: 0, col: 1 } },
        "1,0": { id: "3", type: "light", position: { row: 1, col: 0 } },
        "2,0": { id: "4", type: "vent", position: { row: 2, col: 0 } },
      });

      const { result } = renderHook(() => useComponentStats());

      expect(result.current.light).toBe(3);
      expect(result.current.vent).toBe(1);
      expect(result.current.diffuser).toBe(0);
    });
  });

  describe("memoization", () => {
    it("returns same object reference when components do not change", () => {
      const components = {
        "0,0": { id: "1", type: "diffuser", position: { row: 0, col: 0 } },
      };
      mockComponents.mockReturnValue(components);

      const { result, rerender } = renderHook(() => useComponentStats());

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });
});
