# Ceiling Grid Studio

A professional ceiling grid planning and component placement tool built with React, TypeScript, and Vite. This application allows architects and engineers to design ceiling layouts with various HVAC components, lighting fixtures, and safety equipment.

## Features

### Core Functionality

- **Interactive Grid System**: Standard 0.6m × 0.6m ceiling tiles with customizable room dimensions
- **Component Placement**: Add, remove, and reposition ceiling components
- **Drag & Drop**: Move components by dragging them to new positions
- **Pan & Zoom**: Navigate large grids with smooth panning and zooming (scroll wheel)

### Components

- **Lights** - Ceiling light fixtures
- **Air Supply** - HVAC supply vents
- **Air Return** - HVAC return vents
- **Smoke Detectors** - Safety equipment
- **Invalid Cells** - Mark positions unavailable for components

### UI Features

- **Light/Dark Theme**: Toggle between light and dark modes with CSS custom properties
- **Collapsible Sidebar**: Maximize workspace area when needed
- **Real-time Statistics**: Track component counts
- **Grid Presets**: Quick size selection from 10×10 to 1000×1000
- **Error Boundaries**: Graceful error handling with recovery options
- **Accessibility**: Accessible UI controls with ARIA labels (canvas grid requires mouse interaction)

## Performance

The application is optimized for large grids:

- ✅ 100×100 grids (10,000 cells) - Smooth performance
- ✅ 500×500 grids (250,000 cells) - Good performance
- ✅ 1000×1000 grids (1,000,000 cells) - Functional with viewport culling

### Optimizations Applied

- React Konva canvas-based rendering (not DOM)
- Viewport culling for off-screen cells
- Efficient object-based component storage
- Zustand selectors for optimized re-renders
- Lazy loading with React.lazy and Suspense for code splitting
- TanStack Query ready for efficient server-state caching (future)

## Getting Started

### Prerequisites

- Node.js 20.18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ceiling-grid-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Linting & Testing

```bash
npm run lint          # Run ESLint
npm run test          # Run unit tests in watch mode
npm run test:run      # Run unit tests once
npm run test:coverage # Run unit tests with coverage
npm run test:e2e      # Run Playwright E2E tests
npm run test:e2e:ui   # Run E2E tests with interactive UI
```

## Project Structure

```
ceiling-grid-studio/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── Button/          # Reusable button component
│   │   ├── Dropdown/        # Dropdown menu component
│   │   ├── ErrorBoundary/   # Error boundary wrapper
│   │   ├── Header/          # Top navigation bar
│   │   ├── InfoBadge/       # Information badge component
│   │   ├── Layout/          # Page layout wrapper
│   │   └── __tests__/       # Component tests
│   ├── constants/           # Application constants
│   │   └── ceiling-components.tsx
│   ├── features/            # Feature modules
│   │   ├── grid/            # Grid feature
│   │   │   ├── components/  # CeilingGrid, GridControls, ZoomControls
│   │   │   ├── constants/   # Grid-related constants
│   │   │   └── hooks/       # useGridInteractions, useViewportZoom, etc.
│   │   └── toolbar/         # Toolbar/Sidebar feature
│   │       ├── Sidebar.tsx  # Tool palette sidebar
│   │       └── components/  # ToolButton, ToolSection
│   ├── pages/               # Page components
│   │   └── GridEditorPage/  # Main editor page
│   ├── routes/              # React Router configuration
│   ├── store/               # Zustand state management
│   │   ├── useAppStore.ts   # Main store with selectors
│   │   └── slices/          # gridSlice, uiSlice, viewportSlice
│   ├── styles/              # SCSS styles
│   │   ├── _mixins.scss     # Reusable mixins
│   │   ├── _variables.scss  # Theme variables
│   │   ├── global.scss      # Global styles
│   │   ├── light-theme.css  # Light theme
│   │   └── dark-theme.css   # Dark theme
│   ├── types/               # TypeScript type definitions
│   │   ├── core.types.ts    # Core types (ComponentType, ToolType)
│   │   └── grid.types.ts    # Grid types (GridState, ViewportState)
│   ├── utils/               # Utility functions
│   │   └── grid.utils.ts    # Grid helper functions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── e2e/                     # Playwright E2E tests
├── docs/                    # Documentation
│   └── ARCHITECTURE.md      # Architecture documentation
├── infra/                   # Infrastructure configuration
│   └── Dockerfile           # Docker container configuration (planned)
├── azure-pipelines/         # CI/CD pipeline templates (planned)
│   ├── build.yml            # Build pipeline template
│   ├── push-image.yml       # Push Docker image template
│   └── deploy.yml           # Multi-environment deployment template
├── coverage/                # Test coverage reports
├── .prettierrc              # Prettier configuration
├── eslint.config.js         # ESLint configuration
├── playwright.config.ts     # Playwright E2E configuration
├── package.json
└── README.md
```

## Mouse Controls

| Action                  | Result                       |
| ----------------------- | ---------------------------- |
| Scroll wheel            | Zoom in/out                  |
| Middle mouse drag       | Pan view                     |
| Left click (with tool)  | Place/remove component       |
| Left drag (select mode) | Move component               |
| Left drag (fullscreen)  | Pan view (Google Maps style) |

## Architecture

### State Management

The application uses **Zustand** for global state management with a slice-based architecture:

- **gridSlice**: Grid dimensions and components
- **viewportSlice**: Pan/zoom state (offsetX, offsetY, zoom)
- **uiSlice**: UI preferences (theme, sidebar, fullscreen, selected tool)

Selector hooks (`useGrid`, `useViewport`, `useUI`, `useTheme`, `useSelectedTool`) are provided for optimized re-renders.

### Rendering

The ceiling grid uses **React Konva** for efficient canvas rendering. Key features include:

- Device pixel ratio support for crisp rendering
- Viewport culling to only render visible components
- Efficient component lookup using object-based data structure
- Custom hooks for grid interactions and viewport zoom
- Lazy loading of pages with React.lazy and Suspense for code splitting

### Theming

The application supports light and dark themes using **CSS custom properties**:

- Theme files located in `src/styles/light-theme.css` and `dark-theme.css`
- Variables cover backgrounds, text colors, borders, accents, and component-specific colors
- Theme toggle persisted in Zustand store
- Semantic color tokens for consistent UI (e.g., `--color-danger`, `--accent`)

### Error Handling

Robust error handling with **React Error Boundaries**:

- `ErrorBoundary` component wraps the application to catch rendering errors
- `RouteError` component handles React Router errors
- User-friendly error display with retry/reload options
- Error logging for debugging

### Testing

#### Unit Testing

Unit tests are written with **Vitest** and **React Testing Library**:

- Unit tests for components, hooks, and utilities
- Coverage reports powered by **@vitest/coverage-v8**
- Happy-DOM for fast DOM simulation

```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report (outputs to /coverage)
```

#### E2E Testing

End-to-end tests are written with **Playwright**:

- Browser-based testing with Chromium
- Automatic dev server startup
- Screenshots on failure and trace recording
- HTML test reports

```bash
npm run test:e2e      # Run E2E tests headless
npm run test:e2e:ui   # Run with interactive UI mode
```

### Code Quality

The project uses **ESLint** and **Prettier** for consistent code quality:

- ESLint with TypeScript, React Hooks, and React Refresh plugins
- Prettier configuration for consistent formatting
- ESLint-Prettier integration to avoid conflicts

### Accessibility

The application follows accessibility best practices for UI controls:

- Semantic HTML structure with proper heading hierarchy
- ARIA labels and roles for buttons, menus, and interactive elements
- Sufficient color contrast ratios for text and UI elements
- Visible focus indicators for keyboard navigation

**Note**: The canvas-based grid (React Konva) requires mouse interaction for component placement and is not keyboard accessible. Future versions may add keyboard support for grid navigation.

## CI/CD & Deployment

### Infrastructure (Planned)

The `infra/` folder will contain Docker configuration for containerized deployments:

- **Dockerfile** - Multi-stage build for optimized production images
- Nginx configuration for serving the static SPA

### Azure Pipelines (Planned)

The `azure-pipelines/` folder will contain reusable YAML templates for CI/CD:

| Template         | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| `build.yml`      | Build the application and run tests               |
| `push-image.yml` | Build and push Docker image to container registry |
| `deploy.yml`     | Deploy to multiple environments                   |

### Deployment Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Trigger   │───▶│   Build     │───▶│ Push Image  │───▶│   Deploy    │
│  (PR/Main)  │    │  (Docker)   │    │ (Registry)  │    │ (Multi-env) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

**Single Build, Multi-Environment Deployment:**

- One Docker image built per pipeline run
- Same image promoted across environments (Dev → Staging → Production)
- Environment-specific configuration via environment variables

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Built with [React 19](https://react.dev/) and [TypeScript 6](https://www.typescriptlang.org/)
- State management with [Zustand](https://zustand.docs.pmnd.rs/)
- Canvas rendering with [React Konva](https://konvajs.org/docs/react/)
- Routing with [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/) - Ready for future server-side data fetching
- Bundled with [Vite](https://vitejs.dev/)
- Unit testing with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react)
- E2E testing with [Playwright](https://playwright.dev/)
- Linting with [ESLint](https://eslint.org/) and formatting with [Prettier](https://prettier.io/)
- Icons by [Lucide](https://lucide.dev/)
