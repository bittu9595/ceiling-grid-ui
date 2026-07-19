import type { StateCreator } from "zustand";
import type { ViewportState } from "../../types";

export interface ViewportSlice {
  viewport: ViewportState;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setOffset: (offsetX: number, offsetY: number) => void;
}

export const initialViewportState: ViewportState = {
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
  minZoom: 0.1,
  maxZoom: 5,
};

export const createViewportSlice: StateCreator<
  ViewportSlice,
  [],
  [],
  ViewportSlice
> = (set, get) => ({
  viewport: initialViewportState,

  setZoom: (zoom) => {
    set((state) => ({
      viewport: {
        ...state.viewport,
        zoom: Math.min(
          Math.max(zoom, state.viewport.minZoom),
          state.viewport.maxZoom,
        ),
      },
    }));
  },

  zoomIn: () => {
    const { viewport } = get();
    get().setZoom(viewport.zoom * 1.2);
  },

  zoomOut: () => {
    const { viewport } = get();
    get().setZoom(viewport.zoom / 1.2);
  },

  resetZoom: () => {
    set((state) => ({
      viewport: { ...state.viewport, zoom: 1, offsetX: 0, offsetY: 0 },
    }));
  },

  setOffset: (offsetX, offsetY) => {
    set((state) => ({
      viewport: { ...state.viewport, offsetX, offsetY },
    }));
  },
});
