import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Sidebar } from "../Sidebar";

const mockSelectTool = vi.fn();
const mockClearGrid = vi.fn();
const mockToggleSidebar = vi.fn();
const mockUseAppStore = vi.fn();

vi.mock("../../../store", () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    mockUseAppStore(selector),
}));

vi.mock("../constants", () => ({
  TOOLS: [
    {
      type: "select",
      label: "Select",
      category: "drafting",
      icon: "S",
      description: "Select tool",
    },
    {
      type: "pan",
      label: "Pan",
      category: "drafting",
      icon: "P",
      description: "Pan tool",
    },
    {
      type: "diffuser",
      label: "Diffuser",
      category: "component",
      icon: "D",
      description: "Add diffuser",
    },
    {
      type: "vent",
      label: "Vent",
      category: "component",
      icon: "V",
      description: "Add vent",
    },
    {
      type: "eraser",
      label: "Eraser",
      category: "action",
      icon: "E",
      description: "Erase components",
    },
  ],
}));

vi.mock("lucide-react", () => ({
  Trash2: ({ size }: { size: number }) => (
    <span data-testid="trash-icon" data-size={size}>
      🗑
    </span>
  ),
  ChevronLeft: ({ size }: { size: number }) => (
    <span data-testid="chevron-icon" data-size={size}>
      ◀
    </span>
  ),
  Menu: ({ size }: { size: number }) => (
    <span data-testid="menu-icon" data-size={size}>
      ☰
    </span>
  ),
}));

vi.mock("../components/ToolSection", () => ({
  default: ({
    title,
    tools,
    onSelectTool,
  }: {
    title: string;
    tools: { type: string; label: string }[];
    onSelectTool: (type: string) => void;
  }) => (
    <div data-testid={`tool-section-${title.toLowerCase().replace(" ", "-")}`}>
      <h3>{title}</h3>
      {tools.map((tool) => (
        <button key={tool.type} onClick={() => onSelectTool(tool.type)}>
          {tool.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../components/ToolButton", () => ({
  default: ({
    tool,
    onClick,
  }: {
    tool: { type: string; label: string };
    onClick: () => void;
  }) => (
    <button data-testid={`tool-button-${tool.type}`} onClick={onClick}>
      {tool.label}
    </button>
  ),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppStore.mockImplementation((selector) => {
      const state = {
        ui: { selectedTool: "select", isSidebarCollapsed: false },
        selectTool: mockSelectTool,
        clearGrid: mockClearGrid,
        toggleSidebar: mockToggleSidebar,
      };
      return selector(state);
    });
  });

  describe("rendering", () => {
    it("renders sidebar with data-testid", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toHaveClass("sidebar");
    });

    it("renders title when expanded", () => {
      render(<Sidebar />);
      expect(screen.getByText("AeroGrid Architect")).toBeInTheDocument();
    });

    it("renders subtitle when expanded", () => {
      render(<Sidebar />);
      expect(screen.getByText("Component Library")).toBeInTheDocument();
    });

    it("renders tool sections", () => {
      render(<Sidebar />);
      expect(
        screen.getByTestId("tool-section-drafting-tools"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("tool-section-components")).toBeInTheDocument();
    });

    it("renders clear all button", () => {
      render(<Sidebar />);
      expect(screen.getByTitle("Clear All")).toBeInTheDocument();
    });
  });

  describe("collapsed state", () => {
    beforeEach(() => {
      mockUseAppStore.mockImplementation((selector) => {
        const state = {
          ui: { selectedTool: "select", isSidebarCollapsed: true },
          selectTool: mockSelectTool,
          clearGrid: mockClearGrid,
          toggleSidebar: mockToggleSidebar,
        };
        return selector(state);
      });
    });

    it("applies collapsed class", () => {
      const { container } = render(<Sidebar />);
      expect(
        container.querySelector(".sidebar--collapsed"),
      ).toBeInTheDocument();
    });

    it("hides title when collapsed", () => {
      render(<Sidebar />);
      expect(screen.queryByText("AeroGrid Architect")).not.toBeInTheDocument();
    });

    it("shows menu button when collapsed", () => {
      render(<Sidebar />);
      expect(screen.getByTitle("Expand Sidebar")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls toggleSidebar when collapse button clicked", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      await user.click(screen.getByTitle("Collapse Sidebar"));
      expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it("calls clearGrid when clear button clicked", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      await user.click(screen.getByTitle("Clear All"));
      expect(mockClearGrid).toHaveBeenCalledTimes(1);
    });

    it("calls selectTool when drafting tool clicked", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      await user.click(screen.getByText("Select"));
      expect(mockSelectTool).toHaveBeenCalledWith("select");
    });

    it("calls selectTool when component tool clicked", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      await user.click(screen.getByText("Diffuser"));
      expect(mockSelectTool).toHaveBeenCalledWith("diffuser");
    });
  });

  describe("tool categorization", () => {
    it("groups drafting tools correctly", () => {
      render(<Sidebar />);
      const draftingSection = screen.getByTestId("tool-section-drafting-tools");
      expect(draftingSection).toHaveTextContent("Select");
      expect(draftingSection).toHaveTextContent("Pan");
    });

    it("groups component tools correctly", () => {
      render(<Sidebar />);
      const componentSection = screen.getByTestId("tool-section-components");
      expect(componentSection).toHaveTextContent("Diffuser");
      expect(componentSection).toHaveTextContent("Vent");
    });
  });

  describe("structure", () => {
    it("has header row", () => {
      const { container } = render(<Sidebar />);
      expect(
        container.querySelector(".sidebar__header-row"),
      ).toBeInTheDocument();
    });

    it("has content area", () => {
      const { container } = render(<Sidebar />);
      expect(container.querySelector(".sidebar__content")).toBeInTheDocument();
    });

    it("renders as aside element", () => {
      render(<Sidebar />);
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });
});
