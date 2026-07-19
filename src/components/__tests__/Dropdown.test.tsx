import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Dropdown, type DropdownOption } from "../Dropdown/Dropdown";

const defaultOptions: DropdownOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Dropdown", () => {
  describe("rendering", () => {
    it("renders with label", () => {
      render(<Dropdown label="Select option" options={defaultOptions} />);
      expect(screen.getByText("Select option")).toBeInTheDocument();
    });

    it("renders with placeholder when no value selected", () => {
      render(
        <Dropdown
          label="Select"
          options={defaultOptions}
          placeholder="Choose..."
        />,
      );
      expect(screen.getByText("Choose...")).toBeInTheDocument();
    });

    it("renders selected value label", () => {
      render(
        <Dropdown label="Select" options={defaultOptions} value="option2" />,
      );
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("renders custom trigger content", () => {
      render(
        <Dropdown
          label="Select"
          options={defaultOptions}
          triggerContent={<span data-testid="custom-trigger">Custom</span>}
        />,
      );
      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
    });

    it("hides label visually when hideLabel is true", () => {
      render(
        <Dropdown label="Hidden label" options={defaultOptions} hideLabel />,
      );
      expect(screen.getByText("Hidden label")).toHaveClass(
        "dropdown__label--hidden",
      );
    });
  });

  describe("opening and closing", () => {
    it("opens listbox on click", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("closes listbox on second click", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.click(trigger);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes listbox on Escape key", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("opens on Enter key", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("opens on Space key", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      screen.getByRole("button").focus();
      await user.keyboard(" ");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("calls onChange when option is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Dropdown
          label="Select"
          options={defaultOptions}
          onChange={handleChange}
        />,
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("option", { name: "Option 2" }));

      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("closes after selection", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown label="Select" options={defaultOptions} onChange={vi.fn()} />,
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("option", { name: "Option 1" }));

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("selects on Enter key when option is highlighted", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Dropdown
          label="Select"
          options={defaultOptions}
          onChange={handleChange}
        />,
      );

      await user.click(screen.getByRole("button"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("keyboard navigation", () => {
    it("navigates down with ArrowDown", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      await user.click(screen.getByRole("button"));
      await user.keyboard("{ArrowDown}");

      const options = screen.getAllByRole("option");
      expect(options[1]).toHaveClass("dropdown__option--highlighted");
    });

    it("navigates up with ArrowUp", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      await user.click(screen.getByRole("button"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");

      const options = screen.getAllByRole("option");
      expect(options[1]).toHaveClass("dropdown__option--highlighted");
    });

    it("opens dropdown on ArrowDown when closed", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      screen.getByRole("button").focus();
      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} disabled />);

      await user.click(screen.getByRole("button"));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("disables trigger button", () => {
      render(<Dropdown label="Select" options={defaultOptions} disabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("skips disabled options in navigation", async () => {
      const user = userEvent.setup();
      const optionsWithDisabled: DropdownOption[] = [
        { value: "1", label: "One" },
        { value: "2", label: "Two", disabled: true },
        { value: "3", label: "Three" },
      ];
      render(<Dropdown label="Select" options={optionsWithDisabled} />);

      await user.click(screen.getByRole("button"));
      await user.keyboard("{ArrowDown}");

      const options = screen.getAllByRole("option");
      expect(options[2]).toHaveClass("dropdown__option--highlighted");
    });

    it("does not select disabled option on click", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithDisabled: DropdownOption[] = [
        { value: "1", label: "One" },
        { value: "2", label: "Two", disabled: true },
      ];
      render(
        <Dropdown
          label="Select"
          options={optionsWithDisabled}
          onChange={handleChange}
        />,
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("option", { name: "Two" }));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("error state", () => {
    it("displays error message", () => {
      render(
        <Dropdown
          label="Select"
          options={defaultOptions}
          error="Required field"
        />,
      );
      expect(screen.getByText("Required field")).toBeInTheDocument();
    });

    it("applies error class", () => {
      const { container } = render(
        <Dropdown label="Select" options={defaultOptions} error="Error" />,
      );
      expect(container.querySelector(".dropdown")).toHaveClass(
        "dropdown--error",
      );
    });
  });

  describe("fullWidth", () => {
    it("applies full-width class", () => {
      const { container } = render(
        <Dropdown label="Select" options={defaultOptions} fullWidth />,
      );
      expect(container.querySelector(".dropdown")).toHaveClass(
        "dropdown--full-width",
      );
    });
  });

  describe("accessibility", () => {
    it("has proper aria attributes on trigger", () => {
      render(<Dropdown label="Select" options={defaultOptions} />);
      const trigger = screen.getByRole("button");

      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("updates aria-expanded when open", async () => {
      const user = userEvent.setup();
      render(<Dropdown label="Select" options={defaultOptions} />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("marks selected option with aria-selected", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown label="Select" options={defaultOptions} value="option2" />,
      );

      await user.click(screen.getByRole("button"));
      const selectedOption = screen.getByRole("option", { name: "Option 2" });

      expect(selectedOption).toHaveAttribute("aria-selected", "true");
    });

    it("marks disabled options with aria-disabled", async () => {
      const user = userEvent.setup();
      const optionsWithDisabled: DropdownOption[] = [
        { value: "1", label: "One" },
        { value: "2", label: "Two", disabled: true },
      ];
      render(<Dropdown label="Select" options={optionsWithDisabled} />);

      await user.click(screen.getByRole("button"));
      const disabledOption = screen.getByRole("option", { name: "Two" });

      expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("option description", () => {
    it("renders option descriptions", async () => {
      const user = userEvent.setup();
      const optionsWithDesc: DropdownOption[] = [
        { value: "1", label: "One", description: "First option" },
      ];
      render(<Dropdown label="Select" options={optionsWithDesc} />);

      await user.click(screen.getByRole("button"));
      expect(screen.getByText("First option")).toBeInTheDocument();
    });
  });
});
