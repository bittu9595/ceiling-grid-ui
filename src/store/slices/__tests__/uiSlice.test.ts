import { describe, it, expect, beforeEach } from "vitest";
import { createUISlice, initialUIState, type UISlice } from "../uiSlice";

describe("uiSlice", () => {
  let store: UISlice;
  let setState: (
    partial:
      | UISlice
      | Partial<UISlice>
      | ((state: UISlice) => UISlice | Partial<UISlice>),
  ) => void;
  let getState: () => UISlice;

  beforeEach(() => {
    store = {
      ui: { ...initialUIState },
    } as UISlice;

    setState = (partial) => {
      const result = typeof partial === "function" ? partial(store) : partial;
      store = { ...store, ...result };
    };
    getState = () => store;

    const slice = createUISlice(setState, getState, {} as never);
    store = { ...store, ...slice };
  });

  describe("initialUIState", () => {
    it("has select as default tool", () => {
      expect(initialUIState.selectedTool).toBe("select");
    });

    it("has no selected component", () => {
      expect(initialUIState.selectedComponent).toBeNull();
    });

    it("has sidebar expanded by default", () => {
      expect(initialUIState.isSidebarCollapsed).toBe(false);
    });

    it("has dark theme by default", () => {
      expect(initialUIState.theme).toBe("dark");
    });
  });

  describe("selectTool", () => {
    it("updates selected tool", () => {
      store.selectTool("eraser");
      expect(store.ui.selectedTool).toBe("eraser");
    });

    it("clears selected component when changing tool", () => {
      store.ui.selectedComponent = {
        id: "1",
        type: "light",
        position: { row: 0, col: 0 },
      };
      store.selectTool("pan");
      expect(store.ui.selectedComponent).toBeNull();
    });

    it("can select placement tools", () => {
      store.selectTool("air-supply");
      expect(store.ui.selectedTool).toBe("air-supply");
    });
  });

  describe("selectComponent", () => {
    it("sets selected component", () => {
      const component = {
        id: "1",
        type: "light" as const,
        position: { row: 1, col: 2 },
      };
      store.selectComponent(component);
      expect(store.ui.selectedComponent).toEqual(component);
    });

    it("can clear selected component", () => {
      store.ui.selectedComponent = {
        id: "1",
        type: "light",
        position: { row: 0, col: 0 },
      };
      store.selectComponent(null);
      expect(store.ui.selectedComponent).toBeNull();
    });
  });

  describe("toggleSidebar", () => {
    it("collapses sidebar when expanded", () => {
      store.ui.isSidebarCollapsed = false;
      store.toggleSidebar();
      expect(store.ui.isSidebarCollapsed).toBe(true);
    });

    it("expands sidebar when collapsed", () => {
      store.ui.isSidebarCollapsed = true;
      store.toggleSidebar();
      expect(store.ui.isSidebarCollapsed).toBe(false);
    });
  });

  describe("toggleTheme", () => {
    it("switches from dark to light", () => {
      store.ui.theme = "dark";
      store.toggleTheme();
      expect(store.ui.theme).toBe("light");
    });

    it("switches from light to dark", () => {
      store.ui.theme = "light";
      store.toggleTheme();
      expect(store.ui.theme).toBe("dark");
    });
  });

  describe("setTheme", () => {
    it("sets theme to light", () => {
      store.setTheme("light");
      expect(store.ui.theme).toBe("light");
    });

    it("sets theme to dark", () => {
      store.ui.theme = "light";
      store.setTheme("dark");
      expect(store.ui.theme).toBe("dark");
    });
  });
});
