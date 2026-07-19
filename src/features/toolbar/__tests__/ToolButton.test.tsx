import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ToolButton from "../components/ToolButton";
import type { ToolConfig } from "../constants";

vi.mock("../../../components", () => ({
  Button: ({
    children,
    onClick,
    className,
    title,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className: string;
    title: string;
    "aria-label"?: string;
    "data-testid"?: string;
  }) => (
    <button
      onClick={onClick}
      className={className}
      title={title}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {children}
    </button>
  ),
}));

const mockTool: ToolConfig = {
  type: "select",
  label: "Select",
  icon: <span data-testid="tool-icon">🔍</span>,
  description: "Select and move components",
  category: "drafting",
};

describe("ToolButton", () => {
  describe("rendering", () => {
    it("renders with data-testid based on tool type", () => {
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(screen.getByTestId("tool-select")).toBeInTheDocument();
    });

    it("renders tool icon", () => {
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(screen.getByTestId("tool-icon")).toBeInTheDocument();
    });

    it("renders tool label when expanded", () => {
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(screen.getByText("Select")).toBeInTheDocument();
    });

    it("hides tool label when collapsed", () => {
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={true}
          onClick={vi.fn()}
        />,
      );
      expect(screen.queryByText("Select")).not.toBeInTheDocument();
    });

    it("shows tooltip with description", () => {
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(
        screen.getByTitle("Select and move components"),
      ).toBeInTheDocument();
    });
  });

  describe("active state", () => {
    it("applies active class when active", () => {
      const { container } = render(
        <ToolButton
          tool={mockTool}
          isActive={true}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(
        container.querySelector(".sidebar__tool--active"),
      ).toBeInTheDocument();
    });

    it("does not apply active class when inactive", () => {
      const { container } = render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(
        container.querySelector(".sidebar__tool--active"),
      ).not.toBeInTheDocument();
    });
  });

  describe("collapsed state", () => {
    it("sets aria-label when collapsed", () => {
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={true}
          onClick={vi.fn()}
        />,
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Select",
      );
    });

    it("does not set aria-label when expanded", () => {
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={handleClick}
        />,
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("CSS classes", () => {
    it("applies base class", () => {
      const { container } = render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(container.querySelector(".sidebar__tool")).toBeInTheDocument();
    });

    it("applies type-specific class", () => {
      const { container } = render(
        <ToolButton
          tool={mockTool}
          isActive={false}
          isCollapsed={false}
          onClick={vi.fn()}
        />,
      );
      expect(
        container.querySelector(".sidebar__tool--select"),
      ).toBeInTheDocument();
    });
  });
});
