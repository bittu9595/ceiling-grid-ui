import type { StateCreator } from "zustand";
import type {
  GridComponent,
  GridPosition,
  GridState,
  ComponentType,
  ComponentStats,
} from "../../types";
import { positionToKey, generateComponentId } from "../../utils/grid.utils";
import { CEILING_COMPONENTS } from "../../constants/ceiling-components";

export interface GridSlice {
  grid: GridState;
  setGridSize: (width: number, height: number) => void;
  addComponent: (type: ComponentType, position: GridPosition) => void;
  removeComponent: (position: GridPosition) => void;
  moveComponent: (from: GridPosition, to: GridPosition) => void;
  clearGrid: () => void;
  getComponentAt: (position: GridPosition) => GridComponent | undefined;
  getComponentStats: () => ComponentStats;
}

export const initialGridState: GridState = {
  width: 20,
  height: 15,
  components: {},
  cellSize: 0.6,
};

export const createGridSlice: StateCreator<
  GridSlice & { ui: { selectedComponent: GridComponent | null } },
  [],
  [],
  GridSlice
> = (set, get) => ({
  grid: initialGridState,

  setGridSize: (width, height) => {
    set((state) => {
      const newComponents: Record<string, GridComponent> = {};
      Object.entries(state.grid.components).forEach(([key, comp]) => {
        if (comp.position.row < height && comp.position.col < width) {
          newComponents[key] = comp;
        }
      });
      return {
        grid: { ...state.grid, width, height, components: newComponents },
      };
    });
  },

  addComponent: (type, position) => {
    const component: GridComponent = {
      id: generateComponentId(),
      type,
      position,
    };
    set((state) => ({
      grid: {
        ...state.grid,
        components: {
          ...state.grid.components,
          [positionToKey(position)]: component,
        },
      },
    }));
  },

  removeComponent: (position) => {
    set((state) => {
      const key = positionToKey(position);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _removed, ...newComponents } = state.grid.components;
      return {
        grid: { ...state.grid, components: newComponents },
        ui: {
          ...state.ui,
          selectedComponent:
            state.ui.selectedComponent?.position.row === position.row &&
            state.ui.selectedComponent?.position.col === position.col
              ? null
              : state.ui.selectedComponent,
        },
      };
    });
  },

  moveComponent: (from, to) => {
    set((state) => {
      const fromKey = positionToKey(from);
      const toKey = positionToKey(to);
      const component = state.grid.components[fromKey];

      if (!component || state.grid.components[toKey]) {
        return state;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fromKey]: _removed, ...rest } = state.grid.components;
      const movedComponent = { ...component, position: to };

      return {
        grid: {
          ...state.grid,
          components: { ...rest, [toKey]: movedComponent },
        },
        ui: {
          ...state.ui,
          selectedComponent:
            state.ui.selectedComponent?.id === component.id
              ? movedComponent
              : state.ui.selectedComponent,
        },
      };
    });
  },

  clearGrid: () => {
    set((state) => ({
      grid: { ...state.grid, components: {} },
      ui: { ...state.ui, selectedComponent: null },
    }));
  },

  getComponentAt: (position) => {
    return get().grid.components[positionToKey(position)];
  },

  getComponentStats: () => {
    const components = Object.values(get().grid.components);
    const initialStats = Object.fromEntries(
      CEILING_COMPONENTS.map((c) => [c.type, 0]),
    ) as ComponentStats;

    return components.reduce((stats, comp) => {
      stats[comp.type]++;
      return stats;
    }, initialStats);
  },
});
