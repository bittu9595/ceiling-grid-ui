/**
 * Core type definitions used across the application
 */

/**
 * Component types that can be placed on the ceiling grid
 */
export type ComponentType =
  | "light"
  | "air-supply"
  | "air-return"
  | "smoke-detector"
  | "invalid";

/**
 * Available tools in the editor (component types + utility tools)
 */
export type ToolType = "select" | "pan" | ComponentType | "eraser";

/**
 * Theme modes supported by the application
 */
export type ThemeMode = "light" | "dark";

/**
 * Component metadata for UI display
 */
export interface ComponentInfo {
  type: ComponentType;
  label: string;
  icon: string;
  color: string;
  description: string;
}
