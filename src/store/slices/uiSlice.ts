import type { StateCreator } from "zustand";
import type { GridComponent, ToolType, ThemeMode } from "../../types";
import { TOOL_TYPES } from "../../constants/ceiling-components";

export interface UIState {
  selectedTool: ToolType;
  selectedComponent: GridComponent | null;
  isSidebarCollapsed: boolean;
  theme: ThemeMode;
}

export interface UISlice {
  ui: UIState;
  selectTool: (tool: ToolType) => void;
  selectComponent: (component: GridComponent | null) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const initialUIState: UIState = {
  selectedTool: TOOL_TYPES.SELECT,
  selectedComponent: null,
  isSidebarCollapsed: false,
  theme: "dark",
};

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  ui: initialUIState,

  selectTool: (tool) => {
    set((state) => ({
      ui: { ...state.ui, selectedTool: tool, selectedComponent: null },
    }));
  },

  selectComponent: (component) => {
    set((state) => ({
      ui: { ...state.ui, selectedComponent: component },
    }));
  },

  toggleSidebar: () => {
    set((state) => ({
      ui: { ...state.ui, isSidebarCollapsed: !state.ui.isSidebarCollapsed },
    }));
  },

  toggleTheme: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        theme: state.ui.theme === "light" ? "dark" : "light",
      },
    }));
  },

  setTheme: (theme) => {
    set((state) => ({
      ui: { ...state.ui, theme },
    }));
  },
});
