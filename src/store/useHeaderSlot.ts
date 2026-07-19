import { create } from "zustand";
import type { ComponentType } from "react";

interface HeaderSlotStore {
  MenuComponent: ComponentType | null;
  setMenuSlot: (component: ComponentType | null) => void;
}

const useHeaderSlotStore = create<HeaderSlotStore>((set) => ({
  MenuComponent: null,
  setMenuSlot: (component) => set({ MenuComponent: component }),
}));

/**
 * Hook for Header to consume the menu slot
 */
export function useHeaderMenuSlot() {
  const MenuComponent = useHeaderSlotStore((state) => state.MenuComponent);
  return { MenuComponent };
}

/**
 * Hook for pages to register their header menu content.
 * Call in useEffect to set on mount and clean up on unmount.
 *
 * @example
 * const setMenuSlot = useSetHeaderMenuSlot();
 *
 * useEffect(() => {
 *   setMenuSlot(GridControls);
 *   return () => setMenuSlot(null);
 * }, [setMenuSlot]);
 */
export function useSetHeaderMenuSlot() {
  return useHeaderSlotStore((state) => state.setMenuSlot);
}
