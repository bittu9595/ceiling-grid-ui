import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button/Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders with children", () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole("button", { name: "Click me" }),
      ).toBeInTheDocument();
    });

    it("renders with default type button", () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("allows overriding type", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });

  describe("variants", () => {
    it.each(["primary", "secondary", "ghost", "danger", "icon"] as const)(
      "applies %s variant class",
      (variant) => {
        render(<Button variant={variant}>Button</Button>);
        expect(screen.getByRole("button")).toHaveClass(`btn--${variant}`);
      },
    );

    it("defaults to primary variant", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("btn--primary");
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as const)("applies %s size class", (size) => {
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass(`btn--${size}`);
    });

    it("defaults to md size", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("btn--md");
    });
  });

  describe("icons", () => {
    it("renders start icon", () => {
      render(
        <Button startIcon={<span data-testid="start-icon">★</span>}>
          Button
        </Button>,
      );
      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    });

    it("renders end icon", () => {
      render(
        <Button endIcon={<span data-testid="end-icon">→</span>}>Button</Button>,
      );
      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });

    it("renders both icons", () => {
      render(
        <Button
          startIcon={<span data-testid="start-icon">★</span>}
          endIcon={<span data-testid="end-icon">→</span>}
        >
          Button
        </Button>,
      );
      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("shows loading spinner when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toHaveClass("btn--loading");
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("disables button when loading", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("hides icons when loading", () => {
      render(
        <Button
          isLoading
          startIcon={<span data-testid="start-icon">★</span>}
          endIcon={<span data-testid="end-icon">→</span>}
        >
          Button
        </Button>,
      );
      expect(screen.queryByTestId("start-icon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("end-icon")).not.toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("is disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("does not fire onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Click
        </Button>,
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("fullWidth", () => {
    it("applies full-width class when fullWidth is true", () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole("button")).toHaveClass("btn--full-width");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("supports aria-label for icon buttons", () => {
      render(
        <Button variant="icon" aria-label="Close dialog">
          ✕
        </Button>,
      );
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeInTheDocument();
    });

    it("forwards ref to button element", () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });

  describe("className", () => {
    it("applies custom className", () => {
      render(<Button className="custom-class">Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("merges custom className with base classes", () => {
      render(
        <Button className="custom-class" variant="secondary">
          Button
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn", "btn--secondary", "custom-class");
    });
  });
});
