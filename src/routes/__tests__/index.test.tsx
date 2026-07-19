import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the entire routes module to test router configuration
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    RouterProvider: () => (
      <div data-testid="router-provider">Router Active</div>
    ),
    createBrowserRouter: vi.fn(() => ({})),
  };
});

// Import after mocks
import { AppRoutes } from "..";

describe("AppRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<AppRoutes />);
      expect(screen.getByTestId("router-provider")).toBeInTheDocument();
    });

    it("provides a router", () => {
      render(<AppRoutes />);
      expect(screen.getByText("Router Active")).toBeInTheDocument();
    });
  });
});
