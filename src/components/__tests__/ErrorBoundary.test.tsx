import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ErrorBoundary, RouteError } from "../ErrorBoundary/ErrorBoundary";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useRouteError: vi.fn(),
}));

import { useRouteError } from "react-router-dom";

const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("rendering", () => {
    it("renders children when there is no error", () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>,
      );
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("renders error UI when child throws", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("renders custom fallback when provided", () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError />
        </ErrorBoundary>,
      );
      expect(screen.getByText("Custom fallback")).toBeInTheDocument();
    });
  });

  describe("retry functionality", () => {
    it("renders try again button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );
      expect(
        screen.getByRole("button", { name: "Try again" }),
      ).toBeInTheDocument();
    });

    it("resets error state on retry click", async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const ConditionalError = () => {
        if (shouldThrow) {
          throw new Error("Test error");
        }
        return <div>Recovered content</div>;
      };

      render(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Fix the error condition before retrying
      shouldThrow = false;
      await user.click(screen.getByRole("button", { name: "Try again" }));

      expect(screen.getByText("Recovered content")).toBeInTheDocument();
    });
  });

  describe("error logging", () => {
    it("logs error to console", () => {
      const consoleSpy = vi.spyOn(console, "error");
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});

describe("RouteError", () => {
  beforeEach(() => {
    vi.mocked(useRouteError).mockReset();
  });

  it("displays error message from route error", () => {
    vi.mocked(useRouteError).mockReturnValue(new Error("Route error message"));
    render(<RouteError />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Route error message")).toBeInTheDocument();
  });

  it("displays fallback message when error has no message", () => {
    vi.mocked(useRouteError).mockReturnValue({});
    render(<RouteError />);

    expect(
      screen.getByText("An unexpected error occurred"),
    ).toBeInTheDocument();
  });

  it("renders reload button", () => {
    vi.mocked(useRouteError).mockReturnValue(new Error("Error"));
    render(<RouteError />);

    expect(
      screen.getByRole("button", { name: "Reload Page" }),
    ).toBeInTheDocument();
  });

  it("reloads page on button click", async () => {
    const user = userEvent.setup();
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    vi.mocked(useRouteError).mockReturnValue(new Error("Error"));
    render(<RouteError />);

    await user.click(screen.getByRole("button", { name: "Reload Page" }));
    expect(reloadMock).toHaveBeenCalled();
  });
});
