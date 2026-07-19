import { useState, useCallback } from "react";
import { useAppStore } from "../../../store";

const MIN_SIZE = 1;
const MAX_SIZE = 2000;
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 15;

const clampSize = (value: number) =>
  Math.min(Math.max(value, MIN_SIZE), MAX_SIZE);

/*
 * Manages the grid size controls and preset handling.
 * Keeps custom width/height inputs and preset changes in sync with the store.
 */
export function useGridSizeControls() {
  const grid = useAppStore((state) => state.grid);
  const setGridSize = useAppStore((state) => state.setGridSize);
  const resetZoom = useAppStore((state) => state.resetZoom);

  const [customWidth, setCustomWidth] = useState(grid.width.toString());
  const [customHeight, setCustomHeight] = useState(grid.height.toString());

  /*
   * Applies a preset grid size and resets the related input fields.
   */
  const handlePresetSelect = useCallback(
    (value: string) => {
      const [width, height] = value.split("x").map(Number);
      setGridSize(width, height);
      setCustomWidth(width.toString());
      setCustomHeight(height.toString());
      resetZoom();
    },
    [setGridSize, resetZoom],
  );

  /*
   * Clamps the custom width and height values and updates the grid store.
   */
  const handleCustomSize = useCallback(() => {
    const width = clampSize(Number.parseInt(customWidth) || DEFAULT_WIDTH);
    const height = clampSize(Number.parseInt(customHeight) || DEFAULT_HEIGHT);
    setGridSize(width, height);
    resetZoom();
  }, [customWidth, customHeight, setGridSize, resetZoom]);

  /*
   * Submits the custom size form when Enter is pressed inside the inputs.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCustomSize();
      }
    },
    [handleCustomSize],
  );

  return {
    customWidth,
    customHeight,
    setCustomWidth,
    setCustomHeight,
    handlePresetSelect,
    handleCustomSize,
    handleKeyDown,
  };
}
