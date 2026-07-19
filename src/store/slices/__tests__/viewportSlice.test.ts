import { describe, it, expect, beforeEach } from "vitest";
import {
  createViewportSlice,
  initialViewportState,
  type ViewportSlice,
} from "../viewportSlice";

describe("viewportSlice", () => {
  let store: ViewportSlice;
  let setState: (
    partial:
      | ViewportSlice
      | Partial<ViewportSlice>
      | ((state: ViewportSlice) => ViewportSlice | Partial<ViewportSlice>),
  ) => void;
  let getState: () => ViewportSlice;

  beforeEach(() => {
    store = {
      viewport: { ...initialViewportState },
    } as ViewportSlice;

    setState = (partial) => {
      const result = typeof partial === "function" ? partial(store) : partial;
      store = { ...store, ...result };
    };
    getState = () => store;

    const slice = createViewportSlice(setState, getState, {} as never);
    store = { ...store, ...slice };
  });

  describe("initialViewportState", () => {
    it("has zero offset by default", () => {
      expect(initialViewportState.offsetX).toBe(0);
      expect(initialViewportState.offsetY).toBe(0);
    });

    it("has zoom level 1 by default", () => {
      expect(initialViewportState.zoom).toBe(1);
    });

    it("has correct min zoom", () => {
      expect(initialViewportState.minZoom).toBe(0.1);
    });

    it("has correct max zoom", () => {
      expect(initialViewportState.maxZoom).toBe(5);
    });
  });

  describe("setZoom", () => {
    it("updates zoom level", () => {
      store.setZoom(2);
      expect(store.viewport.zoom).toBe(2);
    });

    it("clamps zoom to minimum", () => {
      store.setZoom(0.05);
      expect(store.viewport.zoom).toBe(0.1);
    });

    it("clamps zoom to maximum", () => {
      store.setZoom(10);
      expect(store.viewport.zoom).toBe(5);
    });

    it("allows zoom at exact minimum", () => {
      store.setZoom(0.1);
      expect(store.viewport.zoom).toBe(0.1);
    });

    it("allows zoom at exact maximum", () => {
      store.setZoom(5);
      expect(store.viewport.zoom).toBe(5);
    });
  });

  describe("zoomIn", () => {
    it("increases zoom by 20%", () => {
      store.viewport.zoom = 1;
      store.zoomIn();
      expect(store.viewport.zoom).toBeCloseTo(1.2);
    });

    it("respects maximum zoom", () => {
      store.viewport.zoom = 4.5;
      store.zoomIn();
      expect(store.viewport.zoom).toBe(5);
    });

    it("can zoom in multiple times", () => {
      store.viewport.zoom = 1;
      store.zoomIn();
      store.zoomIn();
      expect(store.viewport.zoom).toBeCloseTo(1.44);
    });
  });

  describe("zoomOut", () => {
    it("decreases zoom by 20%", () => {
      store.viewport.zoom = 1;
      store.zoomOut();
      expect(store.viewport.zoom).toBeCloseTo(0.833, 2);
    });

    it("respects minimum zoom", () => {
      store.viewport.zoom = 0.15;
      store.zoomOut();
      expect(store.viewport.zoom).toBe(0.125);
    });

    it("can zoom out multiple times", () => {
      store.viewport.zoom = 1;
      store.zoomOut();
      store.zoomOut();
      expect(store.viewport.zoom).toBeCloseTo(0.694, 2);
    });
  });

  describe("resetZoom", () => {
    it("resets zoom to 1", () => {
      store.viewport.zoom = 2.5;
      store.resetZoom();
      expect(store.viewport.zoom).toBe(1);
    });

    it("resets offset to zero", () => {
      store.viewport.offsetX = 100;
      store.viewport.offsetY = 200;
      store.resetZoom();
      expect(store.viewport.offsetX).toBe(0);
      expect(store.viewport.offsetY).toBe(0);
    });
  });

  describe("setOffset", () => {
    it("updates offsetX", () => {
      store.setOffset(150, 0);
      expect(store.viewport.offsetX).toBe(150);
    });

    it("updates offsetY", () => {
      store.setOffset(0, 200);
      expect(store.viewport.offsetY).toBe(200);
    });

    it("updates both offsets", () => {
      store.setOffset(100, 150);
      expect(store.viewport.offsetX).toBe(100);
      expect(store.viewport.offsetY).toBe(150);
    });

    it("allows negative offsets", () => {
      store.setOffset(-50, -100);
      expect(store.viewport.offsetX).toBe(-50);
      expect(store.viewport.offsetY).toBe(-100);
    });
  });
});
