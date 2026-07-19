import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "../Header/Header";

// Mock the store
const mockToggleTheme = vi.fn();
const mockUseAppStore = vi.fn();
const mockUseHeaderMenuSlot = vi.fn();

vi.mock("../../store", () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    mockUseAppStore(selector),
  useHeaderMenuSlot: () => mockUseHeaderMenuSlot(),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Sun: ({ size }: { size: number }) => (
    <span data-testid="sun-icon" data-size={size}>
      Sun
    </span>
  ),
  Moon: ({ size }: { size: number }) => (
    <span data-testid="moon-icon" data-size={size}>
      Moon
    </span>
  ),
  User: ({ size }: { size: number }) => (
    <span data-testid="user-icon" data-size={size}>
      User
    </span>
  ),
  Grid3X3: ({ size, className }: { size: number; className: string }) => (
    <span data-testid="grid-icon" data-size={size} className={className}>
      Grid
    </span>
  ),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHeaderMenuSlot.mockReturnValue({ MenuComponent: null });
  });

  describe("rendering", () => {
    it("renders header with data-testid", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByTestId("header")).toBeInTheDocument();
    });

    it("renders logo and title", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByText("Ceiling Grid Studio")).toBeInTheDocument();
      expect(screen.getByTestId("grid-icon")).toBeInTheDocument();
    });

    it("renders theme toggle button with data-testid", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /switch to dark mode/i }),
      ).toBeInTheDocument();
    });

    it("renders user profile button with data-testid", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /user profile/i }),
      ).toBeInTheDocument();
    });
  });

  describe("theme toggle", () => {
    it("shows Moon icon in light theme", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
    });

    it("shows Sun icon in dark theme", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "dark" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });

    it("calls toggleTheme when theme button is clicked", async () => {
      const user = userEvent.setup();
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      await user.click(screen.getByTestId("theme-toggle"));
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it("has correct aria-label for light theme", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(
        screen.getByRole("button", { name: "Switch to Dark Mode" }),
      ).toBeInTheDocument();
    });

    it("has correct aria-label for dark theme", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "dark" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(
        screen.getByRole("button", { name: "Switch to Light Mode" }),
      ).toBeInTheDocument();
    });
  });

  describe("menu slot", () => {
    it("renders MenuComponent when provided", () => {
      const MockMenu = () => <nav data-testid="custom-menu">Menu</nav>;
      mockUseHeaderMenuSlot.mockReturnValue({ MenuComponent: MockMenu });
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByTestId("custom-menu")).toBeInTheDocument();
    });

    it("does not render center section when no MenuComponent", () => {
      mockUseHeaderMenuSlot.mockReturnValue({ MenuComponent: null });
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      const { container } = render(<Header />);

      expect(
        container.querySelector(".header__center"),
      ).not.toBeInTheDocument();
    });
  });

  describe("structure", () => {
    it("renders header element", () => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = { ui: { theme: "light" }, toggleTheme: mockToggleTheme };
        return selector(state);
      });

      render(<Header />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });
});
