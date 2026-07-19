import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Layout } from "../Layout/Layout";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

// Mock Header component
vi.mock("../Header/Header", () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

describe("Layout", () => {
  describe("rendering", () => {
    it("renders Header component", () => {
      render(<Layout />);
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });

    it("renders Outlet for child routes", () => {
      render(<Layout />);
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });

    it("renders main content area", () => {
      render(<Layout />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  describe("structure", () => {
    it("has layout wrapper class", () => {
      const { container } = render(<Layout />);
      expect(container.querySelector(".layout")).toBeInTheDocument();
    });

    it("has main content with correct class", () => {
      const { container } = render(<Layout />);
      expect(container.querySelector(".layout__main")).toBeInTheDocument();
    });

    it("renders Header before main content", () => {
      const { container } = render(<Layout />);
      const layout = container.querySelector(".layout");
      const children = layout?.children;

      expect(children?.[0]).toHaveAttribute("data-testid", "header");
      expect(children?.[1]).toHaveClass("layout__main");
    });
  });

  describe("semantic HTML", () => {
    it("uses main element for content area", () => {
      render(<Layout />);
      const main = screen.getByRole("main");
      expect(main).toHaveClass("layout__main");
    });
  });
});
