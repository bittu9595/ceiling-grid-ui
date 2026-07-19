import { describe, it, expect, beforeEach } from "vitest";
import {
  createGridSlice,
  initialGridState,
  type GridSlice,
} from "../gridSlice";

import type { GridComponent } from "../../../types";

type StoreType = GridSlice & {
  ui: { selectedComponent: GridComponent | null };
};

describe("gridSlice", () => {
  let store: StoreType;
  let setState: (
    partial:
      | StoreType
      | Partial<StoreType>
      | ((state: StoreType) => StoreType | Partial<StoreType>),
  ) => void;
  let getState: () => StoreType;

  beforeEach(() => {
    store = {
      grid: { ...initialGridState },
      ui: { selectedComponent: null },
    } as StoreType;

    setState = (partial) => {
      const result = typeof partial === "function" ? partial(store) : partial;
      store = { ...store, ...result };
    };
    getState = () => store;

    const slice = createGridSlice(setState, getState, {} as never);
    store = { ...store, ...slice };
  });

  describe("initialGridState", () => {
    it("has correct default width", () => {
      expect(initialGridState.width).toBe(20);
    });

    it("has correct default height", () => {
      expect(initialGridState.height).toBe(15);
    });

    it("has empty components", () => {
      expect(initialGridState.components).toEqual({});
    });

    it("has correct cell size", () => {
      expect(initialGridState.cellSize).toBe(0.6);
    });
  });

  describe("setGridSize", () => {
    it("updates grid width", () => {
      store.setGridSize(30, 20);
      expect(store.grid.width).toBe(30);
    });

    it("updates grid height", () => {
      store.setGridSize(30, 20);
      expect(store.grid.height).toBe(20);
    });

    it("removes components outside new bounds", () => {
      store.addComponent("light", { row: 5, col: 5 });
      store.addComponent("air-supply", { row: 25, col: 25 });

      store.setGridSize(10, 10);

      expect(store.grid.components["5-5"]).toBeDefined();
      expect(store.grid.components["25-25"]).toBeUndefined();
    });

    it("keeps components inside new bounds", () => {
      store.addComponent("light", { row: 2, col: 3 });
      store.setGridSize(30, 30);

      expect(store.grid.components["2-3"]).toBeDefined();
    });
  });

  describe("addComponent", () => {
    it("adds component to grid", () => {
      store.addComponent("light", { row: 0, col: 0 });
      expect(store.grid.components["0-0"]).toBeDefined();
    });

    it("sets correct component type", () => {
      store.addComponent("air-supply", { row: 1, col: 2 });
      expect(store.grid.components["1-2"].type).toBe("air-supply");
    });

    it("sets correct position", () => {
      store.addComponent("light", { row: 3, col: 4 });
      expect(store.grid.components["3-4"].position).toEqual({
        row: 3,
        col: 4,
      });
    });

    it("generates unique id", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.addComponent("air-supply", { row: 0, col: 1 });

      const id1 = store.grid.components["0-0"].id;
      const id2 = store.grid.components["0-1"].id;
      expect(id1).not.toBe(id2);
    });
  });

  describe("removeComponent", () => {
    it("removes component from grid", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.removeComponent({ row: 0, col: 0 });

      expect(store.grid.components["0-0"]).toBeUndefined();
    });

    it("does not affect other components", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.addComponent("air-supply", { row: 1, col: 1 });
      store.removeComponent({ row: 0, col: 0 });

      expect(store.grid.components["1-1"]).toBeDefined();
    });
  });

  describe("moveComponent", () => {
    it("moves component to new position", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.moveComponent({ row: 0, col: 0 }, { row: 2, col: 3 });

      expect(store.grid.components["0-0"]).toBeUndefined();
      expect(store.grid.components["2-3"]).toBeDefined();
    });

    it("updates component position property", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.moveComponent({ row: 0, col: 0 }, { row: 2, col: 3 });

      expect(store.grid.components["2-3"].position).toEqual({
        row: 2,
        col: 3,
      });
    });

    it("preserves component type when moved", () => {
      store.addComponent("air-supply", { row: 0, col: 0 });
      store.moveComponent({ row: 0, col: 0 }, { row: 1, col: 1 });

      expect(store.grid.components["1-1"].type).toBe("air-supply");
    });

    it("does not move if target is occupied", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.addComponent("air-supply", { row: 1, col: 1 });
      store.moveComponent({ row: 0, col: 0 }, { row: 1, col: 1 });

      // Both should still be in original positions
      expect(store.grid.components["0-0"]).toBeDefined();
      expect(store.grid.components["1-1"].type).toBe("air-supply");
    });

    it("does nothing if source is empty", () => {
      store.moveComponent({ row: 0, col: 0 }, { row: 1, col: 1 });
      expect(store.grid.components["1-1"]).toBeUndefined();
    });
  });

  describe("clearGrid", () => {
    it("removes all components", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.addComponent("air-supply", { row: 1, col: 1 });
      store.clearGrid();

      expect(Object.keys(store.grid.components)).toHaveLength(0);
    });
  });

  describe("getComponentAt", () => {
    it("returns component at position", () => {
      store.addComponent("light", { row: 2, col: 3 });
      const component = store.getComponentAt({ row: 2, col: 3 });

      expect(component?.type).toBe("light");
    });

    it("returns undefined for empty position", () => {
      const component = store.getComponentAt({ row: 0, col: 0 });
      expect(component).toBeUndefined();
    });
  });

  describe("getComponentStats", () => {
    it("returns zero counts for empty grid", () => {
      const stats = store.getComponentStats();
      expect(Object.values(stats).every((v) => v === 0)).toBe(true);
    });

    it("counts components by type", () => {
      store.addComponent("light", { row: 0, col: 0 });
      store.addComponent("light", { row: 0, col: 1 });
      store.addComponent("air-supply", { row: 1, col: 0 });

      const stats = store.getComponentStats();
      expect(stats.light).toBe(2);
      expect(stats["air-supply"]).toBe(1);
    });
  });
});
