import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  createGridSlice,
  createViewportSlice,
  createUISlice,
  type GridSlice,
  type ViewportSlice,
  type UISlice,
} from "./slices";

// Combined app state
export type AppState = GridSlice & ViewportSlice & UISlice;

export const useAppStore = create<AppState>()(
  devtools((...a) => ({
    ...createGridSlice(...a),
    ...createViewportSlice(...a),
    ...createUISlice(...a),
  })),
);

// Selector hooks for optimized re-renders
export const useGrid = () => useAppStore((state) => state.grid);
export const useViewport = () => useAppStore((state) => state.viewport);
export const useUI = () => useAppStore((state) => state.ui);
export const useTheme = () => useAppStore((state) => state.ui.theme);
export const useSelectedTool = () =>
  useAppStore((state) => state.ui.selectedTool);
