import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./Button.scss";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Icon to display before children */
  startIcon?: ReactNode;
  /** Icon to display after children */
  endIcon?: ReactNode;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Whether the button takes full width */
  fullWidth?: boolean;
  /** Accessible label for icon-only buttons */
  "aria-label"?: string;
}

/**
 * Accessible Button component with multiple variants and sizes.
 * Supports icons, loading state, and full width mode.
 *
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Save Changes
 * </Button>
 *
 * @example
 * <Button variant="icon" aria-label="Close dialog">
 *   <XIcon />
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      startIcon,
      endIcon,
      isLoading = false,
      fullWidth = false,
      disabled,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const buttonClasses = [
      "btn",
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth && "btn--full-width",
      isLoading && "btn--loading",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="btn__spinner" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="btn__spinner-icon">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
              />
            </svg>
          </span>
        )}
        {!isLoading && startIcon && (
          <span className="btn__icon btn__icon--start" aria-hidden="true">
            {startIcon}
          </span>
        )}
        {children && <span className="btn__content">{children}</span>}
        {!isLoading && endIcon && (
          <span className="btn__icon btn__icon--end" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
