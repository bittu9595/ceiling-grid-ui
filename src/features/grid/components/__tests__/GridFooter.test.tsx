import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GridFooter } from "../GridFooter/GridFooter";

describe("GridFooter", () => {
  describe("rendering", () => {
    it("renders grid dimensions", () => {
      render(<GridFooter width={10} height={8} componentCount={5} />);
      expect(screen.getByText(/10×8 tiles/)).toBeInTheDocument();
    });

    it("renders total cell count", () => {
      render(<GridFooter width={10} height={8} componentCount={5} />);
      expect(screen.getByText(/80 cells/)).toBeInTheDocument();
    });

    it("renders placed component count", () => {
      render(<GridFooter width={10} height={8} componentCount={5} />);
      expect(screen.getByText(/Placed: 5/)).toBeInTheDocument();
    });

    it("renders help text", () => {
      render(<GridFooter width={10} height={8} componentCount={0} />);
      expect(screen.getByText(/Scroll to zoom/)).toBeInTheDocument();
      expect(
        screen.getByText(/Space or middle-drag to pan/),
      ).toBeInTheDocument();
    });
  });

  describe("formatting", () => {
    it("formats large cell counts with locale string", () => {
      render(<GridFooter width={100} height={100} componentCount={0} />);
      expect(screen.getByText(/10,000 cells/)).toBeInTheDocument();
    });

    it("handles zero components", () => {
      render(<GridFooter width={5} height={5} componentCount={0} />);
      expect(screen.getByText(/Placed: 0/)).toBeInTheDocument();
    });

    it("handles single dimension", () => {
      render(<GridFooter width={1} height={1} componentCount={0} />);
      expect(screen.getByText(/1×1 tiles/)).toBeInTheDocument();
      expect(screen.getByText(/1 cells/)).toBeInTheDocument();
    });
  });

  describe("structure", () => {
    it("renders as a footer element", () => {
      render(<GridFooter width={10} height={10} componentCount={0} />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("has left and right sections", () => {
      const { container } = render(
        <GridFooter width={10} height={10} componentCount={0} />,
      );
      expect(container.querySelector(".grid-footer__left")).toBeInTheDocument();
      expect(
        container.querySelector(".grid-footer__right"),
      ).toBeInTheDocument();
    });
  });
});
