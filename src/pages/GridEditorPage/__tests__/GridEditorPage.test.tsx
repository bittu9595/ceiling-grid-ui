import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GridEditorPage from "../GridEditorPage";

// Mock store
const mockIsSidebarCollapsed = vi.fn();
const mockSetMenuSlot = vi.fn();

vi.mock("../../../store", () => ({
  useAppStore: (
    selector: (state: { ui: { isSidebarCollapsed: boolean } }) => boolean,
  ) => selector({ ui: { isSidebarCollapsed: mockIsSidebarCollapsed() } }),
  useSetHeaderMenuSlot: () => mockSetMenuSlot,
}));

// Mock grid features
vi.mock("../../../features/grid", () => ({
  CeilingGrid: () => <div data-testid="ceiling-grid">Ceiling Grid</div>,
  ZoomControls: () => <div data-testid="zoom-controls">Zoom Controls</div>,
  GridControls: () => <div data-testid="grid-controls">Grid Controls</div>,
  GridStatsPanel: () => <div data-testid="grid-stats-panel">Grid Stats</div>,
}));

// Mock sidebar
vi.mock("../../../features/toolbar/Sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe("GridEditorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsSidebarCollapsed.mockReturnValue(false);
  });

  describe("rendering", () => {
    it("renders the page container", () => {
      render(<GridEditorPage />);
      expect(document.querySelector(".grid-editor-page")).toBeInTheDocument();
    });

    it("renders GridStatsPanel", () => {
      render(<GridEditorPage />);
      expect(screen.getByTestId("grid-stats-panel")).toBeInTheDocument();
    });

    it("renders Sidebar", () => {
      render(<GridEditorPage />);
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });

    it("renders CeilingGrid", () => {
      render(<GridEditorPage />);
      expect(screen.getByTestId("ceiling-grid")).toBeInTheDocument();
    });

    it("renders ZoomControls", () => {
      render(<GridEditorPage />);
      expect(screen.getByTestId("zoom-controls")).toBeInTheDocument();
    });
  });

  describe("sidebar collapsed state", () => {
    it("does not have collapsed class when sidebar is expanded", () => {
      mockIsSidebarCollapsed.mockReturnValue(false);
      render(<GridEditorPage />);
      expect(
        document.querySelector(".grid-editor-page--sidebar-collapsed"),
      ).not.toBeInTheDocument();
    });

    it("has collapsed class when sidebar is collapsed", () => {
      mockIsSidebarCollapsed.mockReturnValue(true);
      render(<GridEditorPage />);
      expect(
        document.querySelector(".grid-editor-page--sidebar-collapsed"),
      ).toBeInTheDocument();
    });
  });

  describe("header menu slot", () => {
    it("registers GridControls in header menu slot on mount", () => {
      render(<GridEditorPage />);
      expect(mockSetMenuSlot).toHaveBeenCalled();
    });

    it("clears menu slot on unmount", () => {
      const { unmount } = render(<GridEditorPage />);
      mockSetMenuSlot.mockClear();
      unmount();
      expect(mockSetMenuSlot).toHaveBeenCalledWith(null);
    });
  });

  describe("layout structure", () => {
    it("has main content area", () => {
      render(<GridEditorPage />);
      expect(
        document.querySelector(".grid-editor-page__main"),
      ).toBeInTheDocument();
    });

    it("has canvas area", () => {
      render(<GridEditorPage />);
      expect(
        document.querySelector(".grid-editor-page__canvas-area"),
      ).toBeInTheDocument();
    });
  });
});
