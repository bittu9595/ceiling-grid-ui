import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GridStatsPanel } from "../GridStatsPanel/GridStatsPanel";

const mockUseComponentStats = vi.fn();

vi.mock("../../hooks", () => ({
  useComponentStats: () => mockUseComponentStats(),
}));

vi.mock("../../constants", () => ({
  COMPONENTS: [
    { type: "diffuser", label: "Diffuser" },
    { type: "vent", label: "Vent" },
    { type: "light", label: "Light" },
  ],
}));

describe("GridStatsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseComponentStats.mockReturnValue({
      diffuser: 5,
      vent: 3,
      light: 10,
    });
  });

  describe("rendering", () => {
    it("renders all component types", () => {
      render(<GridStatsPanel />);
      expect(screen.getByText("Diffuser")).toBeInTheDocument();
      expect(screen.getByText("Vent")).toBeInTheDocument();
      expect(screen.getByText("Light")).toBeInTheDocument();
    });

    it("renders component counts", () => {
      render(<GridStatsPanel />);
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("stats display", () => {
    it("displays zero counts", () => {
      mockUseComponentStats.mockReturnValue({
        diffuser: 0,
        vent: 0,
        light: 0,
      });

      render(<GridStatsPanel />);
      const zeros = screen.getAllByText("0");
      expect(zeros).toHaveLength(3);
    });

    it("displays large counts", () => {
      mockUseComponentStats.mockReturnValue({
        diffuser: 999,
        vent: 500,
        light: 1234,
      });

      render(<GridStatsPanel />);
      expect(screen.getByText("999")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("1234")).toBeInTheDocument();
    });
  });

  describe("structure", () => {
    it("has panel wrapper class", () => {
      const { container } = render(<GridStatsPanel />);
      expect(container.querySelector(".grid-stats-panel")).toBeInTheDocument();
    });

    it("applies type-specific classes to stats", () => {
      const { container } = render(<GridStatsPanel />);
      expect(
        container.querySelector(".grid-stats-panel__stat--diffuser"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".grid-stats-panel__stat--vent"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".grid-stats-panel__stat--light"),
      ).toBeInTheDocument();
    });

    it("renders stat dots for each component", () => {
      const { container } = render(<GridStatsPanel />);
      const dots = container.querySelectorAll(".grid-stats-panel__stat-dot");
      expect(dots).toHaveLength(3);
    });
  });
});
