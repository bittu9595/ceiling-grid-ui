import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InfoBadge } from "../InfoBadge/InfoBadge";

describe("InfoBadge", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<InfoBadge>Badge content</InfoBadge>);
      expect(screen.getByText("Badge content")).toBeInTheDocument();
    });

    it("renders complex children", () => {
      render(
        <InfoBadge>
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </InfoBadge>,
      );
      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });
  });

  describe("positions", () => {
    it("defaults to top-right position", () => {
      const { container } = render(<InfoBadge>Badge</InfoBadge>);
      expect(container.querySelector(".info-badge")).toHaveClass(
        "info-badge--top-right",
      );
    });

    it.each(["top-left", "top-right", "bottom-left", "bottom-right"] as const)(
      "applies %s position class",
      (position) => {
        const { container } = render(
          <InfoBadge position={position}>Badge</InfoBadge>,
        );
        expect(container.querySelector(".info-badge")).toHaveClass(
          `info-badge--${position}`,
        );
      },
    );
  });

  describe("className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <InfoBadge className="custom-class">Badge</InfoBadge>,
      );
      expect(container.querySelector(".info-badge")).toHaveClass(
        "custom-class",
      );
    });

    it("merges custom className with base classes", () => {
      const { container } = render(
        <InfoBadge className="custom-class" position="bottom-left">
          Badge
        </InfoBadge>,
      );
      const badge = container.querySelector(".info-badge");
      expect(badge).toHaveClass("info-badge");
      expect(badge).toHaveClass("info-badge--bottom-left");
      expect(badge).toHaveClass("custom-class");
    });

    it("handles empty className", () => {
      const { container } = render(<InfoBadge className="">Badge</InfoBadge>);
      expect(container.querySelector(".info-badge")).toHaveClass("info-badge");
    });
  });

  describe("structure", () => {
    it("renders as a div element", () => {
      const { container } = render(<InfoBadge>Badge</InfoBadge>);
      expect(container.querySelector(".info-badge")?.tagName).toBe("DIV");
    });
  });
});
