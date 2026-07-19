import { useMemo } from "react";
import { useAppStore } from "../../../store";
import { CEILING_COMPONENTS } from "../../../constants/ceiling-components";

/*
 * Returns the number of each ceiling component currently on the grid.
 * Recomputes only when the component map changes.
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
