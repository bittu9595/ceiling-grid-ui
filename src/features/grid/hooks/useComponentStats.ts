import { useMemo } from "react";
import { useAppStore } from "../../../store";
import { CEILING_COMPONENTS } from "../../../constants/ceiling-components";

/**
 * Hook to get component statistics from the grid.
 * Subscribes to grid.components and recomputes only when components change.
 */
export function useComponentStats() {
  const components = useAppStore((state) => state.grid.components);

  return useMemo(() => {
    const initial = Object.fromEntries(
      CEILING_COMPONENTS.map((component) => [component.type, 0]),
    );
    return Object.values(components).reduce((acc, comp) => {
      acc[comp.type]++;
      return acc;
    }, initial);
  }, [components]);
}
