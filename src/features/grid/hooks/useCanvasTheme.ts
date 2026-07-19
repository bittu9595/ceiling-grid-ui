import { useMemo } from "react";
import { useAppStore } from "../../../store";

/**
 * Theme colors for Konva canvas elements.
 * CSS variables don't work with canvas, so we provide the values directly.
 */
const LIGHT_THEME = {
  canvasBg: "#e2e8f0",
  gridAreaBg: "#f5f3ed",
  gridAreaStroke: "#c9c5bc",
  gridLine: "#94a3b8",
  hoverFill: "rgba(0,0,0,0.04)",
  // Tool colors
  selectColor: "#3b82f6",
  panColor: "#64748b",
  eraserColor: "#ef4444",
};

const DARK_THEME = {
  canvasBg: "#0f172a",
  gridAreaBg: "#f5f3ed", // cream color - same as light
  gridAreaStroke: "#c9c5bc",
  gridLine: "#94a3b8",
  hoverFill: "rgba(0,0,0,0.04)",
  // Tool colors
  selectColor: "#3b82f6",
  panColor: "#64748b",
  eraserColor: "#ef4444",
};

/*
 * Returns the canvas color palette for the active theme.
 * Keeps Konva drawing colors in sync with the app's light/dark mode.
 */
export function useCanvasTheme() {
  const theme = useAppStore((state) => state.ui.theme);

  return useMemo(() => (theme === "dark" ? DARK_THEME : LIGHT_THEME), [theme]);
}
