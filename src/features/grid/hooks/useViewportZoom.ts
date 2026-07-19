import { useCallback, type RefObject } from "react";
import { useAppStore } from "../../../store";

/*
 * Clamp zoom level within min/max bounds.
 */
function clampZoom(zoom: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, zoom));
}

/*
 * Calculate new offset after zoom to keep the point under the mouse stationary.
 */
function calculateZoomOffset(
  mouseX: number,
  mouseY: number,
  currentOffsetX: number,
  currentOffsetY: number,
  currentZoom: number,
  newZoom: number,
) {
  const zoomRatio = newZoom / currentZoom;
  return {
    offsetX: mouseX - (mouseX - currentOffsetX) * zoomRatio,
    offsetY: mouseY - (mouseY - currentOffsetY) * zoomRatio,
  };
}

/*
 * Handles wheel-based viewport zooming.
 * Keeps the cursor position anchored while adjusting the canvas zoom level.
 */
export function useViewportZoom(
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const viewport = useAppStore((state) => state.viewport);
  const setZoom = useAppStore((state) => state.setZoom);
  const setOffset = useAppStore((state) => state.setOffset);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = clampZoom(
        viewport.zoom * delta,
        viewport.minZoom,
        viewport.maxZoom,
      );

      const { offsetX, offsetY } = calculateZoomOffset(
        mouseX,
        mouseY,
        viewport.offsetX,
        viewport.offsetY,
        viewport.zoom,
        newZoom,
      );

      setZoom(newZoom);
      setOffset(offsetX, offsetY);
    },
    [containerRef, viewport, setZoom, setOffset],
  );

  return { handleWheel };
}
