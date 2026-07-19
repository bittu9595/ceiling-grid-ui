import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ToolSection from "../components/ToolSection";
import type { ToolType } from "../../../types";
import type { ToolConfig } from "../constants";

const mockTools: ToolConfig[] = [
  {
    type: "select" as ToolType,
    label: "Select",
    icon: <span>S</span>,
    description: "Select tool",
    category: "drafting",
  },
  {
    type: "pan" as ToolType,
    label: "Pan",
    icon: <span>P</span>,
    description: "Pan tool",
    category: "drafting",
  },
];

describe("ToolSection", () => {
  describe("rendering", () => {
    it("renders section title when expanded", () => {
      render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={vi.fn()}
        />,
      );
      expect(screen.getByText("Drafting Tools")).toBeInTheDocument();
    });

    it("hides section title when collapsed", () => {
      render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={true}
          onSelectTool={vi.fn()}
        />,
      );
      expect(screen.queryByText("Drafting Tools")).not.toBeInTheDocument();
    });

    it("renders all tools", () => {
      render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={vi.fn()}
        />,
      );
      expect(screen.getByText("Select")).toBeInTheDocument();
      expect(screen.getByText("Pan")).toBeInTheDocument();
    });
  });

  describe("tool selection", () => {
    it("marks selected tool as active", () => {
      const { container } = render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={vi.fn()}
        />,
      );
      expect(container.querySelector(".sidebar__tool--select")).toHaveClass(
        "sidebar__tool--active",
      );
      expect(container.querySelector(".sidebar__tool--pan")).not.toHaveClass(
        "sidebar__tool--active",
      );
    });

    it("calls onSelectTool when tool clicked", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={handleSelect}
        />,
      );

      await user.click(screen.getByText("Pan"));
      expect(handleSelect).toHaveBeenCalledWith("pan");
    });
  });

  describe("structure", () => {
    it("has section wrapper class", () => {
      const { container } = render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={vi.fn()}
        />,
      );
      expect(container.querySelector(".sidebar__section")).toBeInTheDocument();
    });

    it("has tools container", () => {
      const { container } = render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={vi.fn()}
        />,
      );
      expect(container.querySelector(".sidebar__tools")).toBeInTheDocument();
    });

    it("renders title with correct class", () => {
      const { container } = render(
        <ToolSection
          title="Drafting Tools"
          tools={mockTools}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={vi.fn()}
        />,
      );
      expect(
        container.querySelector(".sidebar__section-title"),
      ).toHaveTextContent("Drafting Tools");
    });
  });

  describe("empty state", () => {
    it("renders with empty tools array", () => {
      const { container } = render(
        <ToolSection
          title="Empty Section"
          tools={[]}
          selectedTool={"select" as ToolType}
          isCollapsed={false}
          onSelectTool={vi.fn()}
        />,
      );
      expect(container.querySelector(".sidebar__section")).toBeInTheDocument();
      expect(container.querySelector(".sidebar__tools")?.children).toHaveLength(
        0,
      );
    });
  });
});
