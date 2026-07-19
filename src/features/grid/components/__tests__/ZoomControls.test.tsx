import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZoomControls } from "../ZoomControls/ZoomControls";

const mockZoomIn = vi.fn();
const mockZoomOut = vi.fn();
const mockResetZoom = vi.fn();
const mockUseAppStore = vi.fn();

vi.mock("../../../../store", () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    mockUseAppStore(selector),
}));

vi.mock("lucide-react", () => ({
  Plus: ({ size }: { size: number }) => (
    <span data-testid="plus-icon" data-size={size}>
      +
    </span>
  ),
  Minus: ({ size }: { size: number }) => (
    <span data-testid="minus-icon" data-size={size}>
      -
    </span>
  ),
  RotateCcw: ({ size }: { size: number }) => (
    <span data-testid="reset-icon" data-size={size}>
      ↺
    </span>
  ),
}));

describe("ZoomControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppStore.mockImplementation((selector) => {
      const state = {
        viewport: { zoom: 1, minZoom: 0.25, maxZoom: 4 },
        zoomIn: mockZoomIn,
        zoomOut: mockZoomOut,
        resetZoom: mockResetZoom,
      };
      return selector(state);
    });
  });

  describe("rendering", () => {
    it("renders zoom controls container", () => {
      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-controls")).toBeInTheDocument();
    });

    it("renders zoom in button", () => {
      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-in")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Zoom in" }),
      ).toBeInTheDocument();
    });

    it("renders zoom out button", () => {
      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-out")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Zoom out" }),
      ).toBeInTheDocument();
    });

    it("renders reset button", () => {
      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-reset")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Reset zoom" }),
      ).toBeInTheDocument();
    });

    it("renders current zoom level", () => {
      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-level")).toHaveTextContent("100%");
    });
  });

  describe("zoom percentage display", () => {
    it("displays zoom as percentage", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = {
          viewport: { zoom: 0.5, minZoom: 0.25, maxZoom: 4 },
          zoomIn: mockZoomIn,
          zoomOut: mockZoomOut,
          resetZoom: mockResetZoom,
        };
        return selector(state);
      });

      render(<ZoomControls />);
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("rounds zoom percentage", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = {
          viewport: { zoom: 0.333, minZoom: 0.25, maxZoom: 4 },
          zoomIn: mockZoomIn,
          zoomOut: mockZoomOut,
          resetZoom: mockResetZoom,
        };
        return selector(state);
      });

      render(<ZoomControls />);
      expect(screen.getByText("33%")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls zoomIn when plus button clicked", async () => {
      const user = userEvent.setup();
      render(<ZoomControls />);

      await user.click(screen.getByTestId("zoom-in"));
      expect(mockZoomIn).toHaveBeenCalledTimes(1);
    });

    it("calls zoomOut when minus button clicked", async () => {
      const user = userEvent.setup();
      render(<ZoomControls />);

      await user.click(screen.getByTestId("zoom-out"));
      expect(mockZoomOut).toHaveBeenCalledTimes(1);
    });

    it("calls resetZoom when reset button clicked", async () => {
      const user = userEvent.setup();
      render(<ZoomControls />);

      await user.click(screen.getByTestId("zoom-reset"));
      expect(mockResetZoom).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled states", () => {
    it("disables zoom in at max zoom", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = {
          viewport: { zoom: 4, minZoom: 0.25, maxZoom: 4 },
          zoomIn: mockZoomIn,
          zoomOut: mockZoomOut,
          resetZoom: mockResetZoom,
        };
        return selector(state);
      });

      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-in")).toBeDisabled();
    });

    it("disables zoom out at min zoom", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = {
          viewport: { zoom: 0.25, minZoom: 0.25, maxZoom: 4 },
          zoomIn: mockZoomIn,
          zoomOut: mockZoomOut,
          resetZoom: mockResetZoom,
        };
        return selector(state);
      });

      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-out")).toBeDisabled();
    });

    it("enables both buttons within zoom range", () => {
      render(<ZoomControls />);
      expect(screen.getByTestId("zoom-in")).not.toBeDisabled();
      expect(screen.getByTestId("zoom-out")).not.toBeDisabled();
    });
  });

  describe("structure", () => {
    it("has zoom controls wrapper with data-testid", () => {
      render(<ZoomControls />);
      const wrapper = screen.getByTestId("zoom-controls");
      expect(wrapper).toHaveClass("zoom-controls");
    });

    it("has divider between zoom and reset", () => {
      const { container } = render(<ZoomControls />);
      expect(
        container.querySelector(".zoom-controls__divider"),
      ).toBeInTheDocument();
    });
  });
});
