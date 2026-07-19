import { describe, it, expect } from "vitest";
import {
  positionToKey,
  keyToPosition,
  generateComponentId,
  pixelToGridPosition,
  isPositionInBounds,
} from "../grid.utils";

describe("grid.utils", () => {
  describe("positionToKey", () => {
    it("converts position to key string", () => {
      expect(positionToKey({ row: 0, col: 0 })).toBe("0-0");
    });

    it("handles positive row and col", () => {
      expect(positionToKey({ row: 5, col: 10 })).toBe("5-10");
    });

    it("handles large numbers", () => {
      expect(positionToKey({ row: 100, col: 200 })).toBe("100-200");
    });

    it("uses dash as separator", () => {
      const key = positionToKey({ row: 1, col: 2 });
      expect(key).toContain("-");
      expect(key.split("-")).toHaveLength(2);
    });

    it("puts row first, col second", () => {
      const key = positionToKey({ row: 3, col: 7 });
      const [row, col] = key.split("-").map(Number);
      expect(row).toBe(3);
      expect(col).toBe(7);
    });
  });

  describe("keyToPosition", () => {
    it("parses key string to position", () => {
      expect(keyToPosition("0-0")).toEqual({ row: 0, col: 0 });
    });

    it("parses positive numbers", () => {
      expect(keyToPosition("5-10")).toEqual({ row: 5, col: 10 });
    });

    it("parses large numbers", () => {
      expect(keyToPosition("100-200")).toEqual({ row: 100, col: 200 });
    });

    it("returns correct row value", () => {
      const { row } = keyToPosition("7-3");
      expect(row).toBe(7);
    });

    it("returns correct col value", () => {
      const { col } = keyToPosition("7-3");
      expect(col).toBe(3);
    });
  });

  describe("positionToKey and keyToPosition roundtrip", () => {
    it("roundtrips correctly", () => {
      const original = { row: 15, col: 25 };
      const key = positionToKey(original);
      const parsed = keyToPosition(key);
      expect(parsed).toEqual(original);
    });

    it("roundtrips zero position", () => {
      const original = { row: 0, col: 0 };
      expect(keyToPosition(positionToKey(original))).toEqual(original);
    });

    it("roundtrips large position", () => {
      const original = { row: 999, col: 1000 };
      expect(keyToPosition(positionToKey(original))).toEqual(original);
    });
  });

  describe("generateComponentId", () => {
    it("returns a string", () => {
      expect(typeof generateComponentId()).toBe("string");
    });

    it("starts with comp- prefix", () => {
      expect(generateComponentId()).toMatch(/^comp-/);
    });

    it("generates unique IDs", () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateComponentId());
      }
      expect(ids.size).toBe(100);
    });

    it("includes timestamp in ID", () => {
      const before = Date.now();
      const id = generateComponentId();
      const after = Date.now();

      // Extract timestamp from ID (format: comp-{timestamp}-{random})
      const parts = id.split("-");
      const timestamp = Number(parts[1]);

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it("has correct format with three parts", () => {
      const id = generateComponentId();
      const parts = id.split("-");
      expect(parts.length).toBe(3);
      expect(parts[0]).toBe("comp");
    });

    it("random suffix is alphanumeric", () => {
      const id = generateComponentId();
      const parts = id.split("-");
      const randomPart = parts[2];
      expect(randomPart).toMatch(/^[a-z0-9]+$/);
    });

    it("random suffix has expected length", () => {
      const id = generateComponentId();
      const parts = id.split("-");
      const randomPart = parts[2];
      // substring(2, 11) gives 9 chars max
      expect(randomPart.length).toBeGreaterThan(0);
      expect(randomPart.length).toBeLessThanOrEqual(9);
    });
  });

  describe("pixelToGridPosition", () => {
    it("converts pixel coordinates to grid position", () => {
      // cellSize=40, offset=0: pixel (80, 120) → (col=2, row=3)
      expect(pixelToGridPosition(80, 120, 0, 0, 40)).toEqual({
        row: 3,
        col: 2,
      });
    });

    it("handles offset correctly", () => {
      // cellSize=40, offset=(50,100): pixel (130, 220) → ((130-50)/40=2, (220-100)/40=3)
      expect(pixelToGridPosition(130, 220, 50, 100, 40)).toEqual({
        row: 3,
        col: 2,
      });
    });

    it("returns negative positions for pixels before offset", () => {
      expect(pixelToGridPosition(20, 30, 50, 50, 40)).toEqual({
        row: -1,
        col: -1,
      });
    });

    it("handles zero pixel coordinates", () => {
      expect(pixelToGridPosition(0, 0, 0, 0, 40)).toEqual({ row: 0, col: 0 });
    });

    it("floors to nearest cell", () => {
      // 39 pixels is still in cell 0 with cellSize=40
      expect(pixelToGridPosition(39, 39, 0, 0, 40)).toEqual({ row: 0, col: 0 });
      expect(pixelToGridPosition(40, 40, 0, 0, 40)).toEqual({ row: 1, col: 1 });
    });

    it("works with different cell sizes", () => {
      expect(pixelToGridPosition(100, 100, 0, 0, 50)).toEqual({
        row: 2,
        col: 2,
      });
      expect(pixelToGridPosition(100, 100, 0, 0, 25)).toEqual({
        row: 4,
        col: 4,
      });
    });
  });

  describe("isPositionInBounds", () => {
    it("returns true for position within bounds", () => {
      expect(isPositionInBounds({ row: 5, col: 5 }, 10, 10)).toBe(true);
    });

    it("returns true for position at origin", () => {
      expect(isPositionInBounds({ row: 0, col: 0 }, 10, 10)).toBe(true);
    });

    it("returns true for position at max bounds", () => {
      expect(isPositionInBounds({ row: 9, col: 9 }, 10, 10)).toBe(true);
    });

    it("returns false for negative row", () => {
      expect(isPositionInBounds({ row: -1, col: 5 }, 10, 10)).toBe(false);
    });

    it("returns false for negative col", () => {
      expect(isPositionInBounds({ row: 5, col: -1 }, 10, 10)).toBe(false);
    });

    it("returns false for row at grid height", () => {
      expect(isPositionInBounds({ row: 10, col: 5 }, 10, 10)).toBe(false);
    });

    it("returns false for col at grid width", () => {
      expect(isPositionInBounds({ row: 5, col: 10 }, 10, 10)).toBe(false);
    });

    it("returns false for row beyond grid height", () => {
      expect(isPositionInBounds({ row: 15, col: 5 }, 10, 10)).toBe(false);
    });

    it("handles non-square grids", () => {
      expect(isPositionInBounds({ row: 5, col: 15 }, 20, 10)).toBe(true);
      expect(isPositionInBounds({ row: 15, col: 5 }, 10, 20)).toBe(true);
    });
  });
});
