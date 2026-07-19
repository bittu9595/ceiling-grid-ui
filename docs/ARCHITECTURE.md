# Architecture Documentation

## Overview

Ceiling Grid Studio is a single-page application (SPA) built with React 19 and TypeScript. It uses a canvas-based rendering system for the grid to ensure optimal performance with large datasets.

## Technology Stack

| Technology      | Purpose                                  |
| --------------- | ---------------------------------------- |
| React 19        | UI Framework                             |
| TypeScript      | Type Safety                              |
| Vite            | Build Tool & Dev Server                  |
| Zustand         | State Management                         |
| react-konva     | Canvas Rendering (2D)                    |
| @tanstack/query | Server State Management                  |
| SCSS            | Styling (with CSS Variables for theming) |
| Lucide React    | Icon Library                             |
| Vitest          | Testing Framework                        |

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              QueryClientProvider + Router               │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │               GridEditorPage                      │  │ │
│  │  │  ┌─────────┐ ┌─────────┐ ┌──────────────────┐   │  │ │
│  │  │  │ Header  │ │ Sidebar │ │   CeilingGrid    │   │  │ │
│  │  │  └─────────┘ └─────────┘ │  (react-konva)   │   │  │ │
│  │  │                          └──────────────────┘   │  │ │
│  │  │  ┌──────────────┐  ┌────────────────────┐      │  │ │
│  │  │  │ ZoomControls │  │   GridStatsPanel   │      │  │ │
│  │  │  └──────────────┘  └────────────────────┘      │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## State Management

### Zustand Store

The application uses Zustand for state management with a slice-based architecture. This provides a centralized store with optimized re-renders through selective subscriptions.

#### Store Structure

```typescript
interface AppState {
  // Grid slice
  grid: {
    width: number;
    height: number;
    components: Record<string, GridComponent>;
  };

  // Viewport slice
  viewport: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };

  // UI slice
  ui: {
    selectedTool: ToolType;
    selectedComponent: GridComponent | null;
    theme: ThemeMode;
    isSidebarCollapsed: boolean;
  };
}
```

### Store Slices

State is organized into slices for maintainability:

| Slice      | Purpose                               |
| ---------- | ------------------------------------- |
| `grid`     | Grid dimensions and placed components |
| `viewport` | Pan, zoom, and view state             |
| `ui`       | Theme, tools, and UI state            |

### Actions (Store Methods)

```typescript
// Grid actions
setGridSize(width, height);
addComponent(position, type);
removeComponent(position);
selectComponent(component);
clearGrid();

// Viewport actions
setZoom(zoom);
setOffset(offsetX, offsetY);
resetViewport();

// UI actions
selectTool(tool);
setTheme(theme);
toggleSidebar();
```

## Component Architecture

### CeilingGrid (Canvas Component)

The core rendering component uses react-konva for high-performance canvas rendering. Key features:

1. **Layer-Based Architecture**: Separate layers for background, grid lines, components, and hover preview
2. **Viewport Culling**: Only renders components visible in the current viewport
3. **Memoization**: All layer components use `React.memo` to prevent unnecessary re-renders
4. **Device Pixel Ratio Support**: Ensures crisp rendering on high-DPI displays

```typescript
// Layer components (all memoized)
- GridBackground: Canvas and grid area background
- GridLines: Grid line rendering with custom Shape
- GridCell: Renders placed components
- HoverPreview: Shows tool preview on hover
- ComponentShape: Renders individual ceiling components
```

### Header Component

Contains:

- Application branding
- Grid dimension inputs
- Preset size selector
- Component statistics
- Theme toggle

### Sidebar Component

Collapsible tool palette with:

- Tool selection buttons
- Visual feedback for active tool
- Drafting mode indicator

## Theming System

The application uses CSS custom properties for theming:

```scss
// Light theme
:root {
  --bg-primary: #ffffff;
  --text-primary: #1e293b;
  // ...
}

// Dark theme
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  // ...
}
```

Theme is applied via `data-theme` attribute on the `<html>` element.

## Performance Optimizations

### 1. Canvas Rendering with react-konva

DOM-based grids would create millions of elements for large grids. react-konva renders all elements in a single canvas element with a React-friendly API.

### 2. Viewport Culling

Only components within the visible viewport are rendered:

```typescript
const visibleComponents = useMemo(() => {
  return Object.values(components).filter((comp) =>
    isInViewport(comp.position, viewBounds),
  );
}, [components, viewBounds]);
```

### 3. Memoized Layer Components

All canvas layer components use `React.memo` to prevent unnecessary re-renders:

```typescript
export const GridBackground = memo(GridBackgroundComponent);
export const GridLines = memo(GridLinesComponent);
export const HoverPreview = memo(HoverPreviewComponent);
```

### 4. Component Storage

Components are stored in a flat object with position keys for O(1) lookup:

```typescript
const key = positionToKey({ row, col }); // "row-col"
const component = components[key];
```

### 5. Zustand Selective Subscriptions

Components subscribe only to the state they need, minimizing re-renders:

```typescript
const zoom = useAppStore((state) => state.viewport.zoom);
const theme = useAppStore((state) => state.ui.theme);
```

### 6. Custom Hooks for Computed Values

Frequently computed values are memoized in custom hooks:

```typescript
const stats = useComponentStats(); // Memoized component counts
const theme = useCanvasTheme(); // Memoized theme colors
```

## File Structure Rationale

```
src/
├── components/     # Shared UI components (Button, Dropdown, etc.)
│   └── Component/
│       ├── Component.tsx
│       ├── Component.scss
│       └── index.ts
├── features/       # Feature-based modules
│   ├── grid/       # Grid editor feature
│   │   ├── components/  # Grid-specific components
│   │   ├── hooks/       # Grid-specific hooks
│   │   └── constants/   # Grid configuration
│   └── toolbar/    # Sidebar toolbar feature
├── store/          # Zustand state management
│   ├── slices/     # State slices (grid, ui, viewport)
│   └── useAppStore.ts
├── pages/          # Page components
├── routes/         # React Router configuration
├── styles/         # Global styles and SCSS utilities
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Root component
└── main.tsx        # Application entry point
```

### Why This Structure?

1. **Colocation**: Each component's styles are adjacent to its logic
2. **Barrel Exports**: `index.ts` files enable clean imports
3. **Separation of Concerns**: Types, styles, and logic are organized
4. **Scalability**: Easy to add new components or features

## Browser Compatibility

The application uses modern web APIs:

- Konva.js (HTML5 Canvas wrapper via react-konva)
- CSS Custom Properties
- ES2020+ JavaScript

Recommended browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
