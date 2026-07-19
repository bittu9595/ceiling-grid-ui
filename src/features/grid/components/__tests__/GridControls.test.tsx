import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GridControls } from "../GridControls/GridControls";

const mockSetCustomWidth = vi.fn();
const mockSetCustomHeight = vi.fn();
const mockHandlePresetSelect = vi.fn();
const mockHandleCustomSize = vi.fn();
const mockHandleKeyDown = vi.fn();
const mockUseAppStore = vi.fn();

vi.mock("../../../../store", () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    mockUseAppStore(selector),
}));

vi.mock("../../hooks", () => ({
  useComponentStats: () => ({ diffuser: 5, vent: 3, light: 2 }),
  useGridSizeControls: () => ({
    customWidth: "10",
    customHeight: "8",
    setCustomWidth: mockSetCustomWidth,
    setCustomHeight: mockSetCustomHeight,
    handlePresetSelect: mockHandlePresetSelect,
    handleCustomSize: mockHandleCustomSize,
    handleKeyDown: mockHandleKeyDown,
  }),
}));

vi.mock("../../constants", () => ({
  COMPONENTS: [
    { type: "diffuser", label: "Diffuser" },
    { type: "vent", label: "Vent" },
    { type: "light", label: "Light" },
  ],
  GRID_PRESETS: [
    { width: 10, height: 10, label: "Small (10×10)" },
    { width: 20, height: 20, label: "Medium (20×20)" },
    { width: 50, height: 50, label: "Large (50×50)" },
  ],
}));

vi.mock("../../../../components/Dropdown/Dropdown", () => ({
  Dropdown: ({
    label,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <div data-testid="dropdown">
      <span>{label}</span>
      <button onClick={() => onChange("20x20")}>{value || placeholder}</button>
    </div>
  ),
}));

describe("GridControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppStore.mockImplementation((selector) => {
      const state = { grid: { width: 10, height: 8 } };
      return selector(state);
    });
  });

  describe("rendering", () => {
    it("renders width input", () => {
      render(<GridControls />);
      expect(screen.getByLabelText("WIDTH")).toBeInTheDocument();
    });

    it("renders height input", () => {
      render(<GridControls />);
      expect(screen.getByLabelText("HEIGHT")).toBeInTheDocument();
    });

    it("renders preset dropdown", () => {
      render(<GridControls />);
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    });

    it("renders component stats", () => {
      render(<GridControls />);
      expect(screen.getByText("Diffuser")).toBeInTheDocument();
      expect(screen.getByText("Vent")).toBeInTheDocument();
      expect(screen.getByText("Light")).toBeInTheDocument();
    });
  });

  describe("width input", () => {
    it("displays current width value", () => {
      render(<GridControls />);
      expect(screen.getByLabelText("WIDTH")).toHaveValue(10);
    });

    it("calls setCustomWidth on change", async () => {
      const user = userEvent.setup();
      render(<GridControls />);

      const input = screen.getByLabelText("WIDTH");
      await user.clear(input);
      await user.type(input, "15");

      expect(mockSetCustomWidth).toHaveBeenCalled();
    });

    it("calls handleCustomSize on blur", () => {
      render(<GridControls />);
      const input = screen.getByLabelText("WIDTH");
      fireEvent.blur(input);
      expect(mockHandleCustomSize).toHaveBeenCalled();
    });

    it("calls handleKeyDown on key press", () => {
      render(<GridControls />);
      const input = screen.getByLabelText("WIDTH");
      fireEvent.keyDown(input, { key: "Enter" });
      expect(mockHandleKeyDown).toHaveBeenCalled();
    });

    it("has min and max attributes", () => {
      render(<GridControls />);
      const input = screen.getByLabelText("WIDTH");
      expect(input).toHaveAttribute("min", "1");
      expect(input).toHaveAttribute("max", "2000");
    });
  });

  describe("height input", () => {
    it("displays current height value", () => {
      render(<GridControls />);
      expect(screen.getByLabelText("HEIGHT")).toHaveValue(8);
    });

    it("calls setCustomHeight on change", async () => {
      const user = userEvent.setup();
      render(<GridControls />);

      const input = screen.getByLabelText("HEIGHT");
      await user.clear(input);
      await user.type(input, "12");

      expect(mockSetCustomHeight).toHaveBeenCalled();
    });

    it("calls handleCustomSize on blur", () => {
      render(<GridControls />);
      const input = screen.getByLabelText("HEIGHT");
      fireEvent.blur(input);
      expect(mockHandleCustomSize).toHaveBeenCalled();
    });
  });

  describe("preset dropdown", () => {
    it("calls handlePresetSelect when preset selected", async () => {
      const user = userEvent.setup();
      render(<GridControls />);

      await user.click(screen.getByTestId("dropdown").querySelector("button")!);
      expect(mockHandlePresetSelect).toHaveBeenCalledWith("20x20");
    });
  });

  describe("stats display", () => {
    it("displays component counts", () => {
      render(<GridControls />);
      expect(screen.getByText("5")).toBeInTheDocument(); // diffuser
      expect(screen.getByText("3")).toBeInTheDocument(); // vent
      expect(screen.getByText("2")).toBeInTheDocument(); // light
    });
  });

  describe("structure", () => {
    it("has grid controls wrapper", () => {
      const { container } = render(<GridControls />);
      expect(container.querySelector(".grid-controls")).toBeInTheDocument();
    });

    it("has dimensions section", () => {
      const { container } = render(<GridControls />);
      expect(
        container.querySelector(".grid-controls__dimensions"),
      ).toBeInTheDocument();
    });

    it("has stats section", () => {
      const { container } = render(<GridControls />);
      expect(
        container.querySelector(".grid-controls__stats"),
      ).toBeInTheDocument();
    });
  });
});
