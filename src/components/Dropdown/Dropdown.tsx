import { useState, useRef, useId, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import "./Dropdown.scss";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  hideLabel?: boolean;
  triggerContent?: ReactNode;
  className?: string;
}

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export function Dropdown({
  label,
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  error,
  fullWidth = false,
  hideLabel = false,
  triggerContent,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selected = options.find((o) => o.value === value);
  const enabled = options
    .map((o, i) => (!o.disabled ? i : -1))
    .filter((i) => i >= 0);

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    const idx = options.findIndex((o) => o.value === value);
    setHighlighted(idx >= 0 ? idx : (enabled[0] ?? -1));
  };

  const close = () => {
    setIsOpen(false);
    setHighlighted(-1);
    triggerRef.current?.focus();
  };

  const select = (opt: DropdownOption) => {
    if (opt.disabled) return;
    onChange?.(opt.value);
    close();
  };

  const navigate = (dir: 1 | -1) => {
    const cur = enabled.indexOf(highlighted);
    const next =
      enabled[cur + dir] ?? enabled[dir === 1 ? 0 : enabled.length - 1];
    setHighlighted(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const key = e.key;
    if (key === "Escape") return close();
    if (key === "Tab" && isOpen) return close();
    if (["Enter", " "].includes(key)) {
      e.preventDefault();
      if (!isOpen) return open();
      if (highlighted >= 0 && !options[highlighted]?.disabled)
        select(options[highlighted]);
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(key)) {
      e.preventDefault();
      if (isOpen) {
        navigate(key === "ArrowDown" ? 1 : -1);
      } else {
        open();
      }
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !listboxRef.current?.contains(e.target as Node)
      )
        close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Scroll highlighted into view
  useEffect(() => {
    if (isOpen && highlighted >= 0) {
      (
        listboxRef.current?.children[highlighted] as HTMLElement
      )?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, highlighted]);

  return (
    <div
      className={cx(
        "dropdown",
        fullWidth && "dropdown--full-width",
        error && "dropdown--error",
        disabled && "dropdown--disabled",
        isOpen && "dropdown--open",
        className,
      )}
    >
      <span
        id={`${id}-label`}
        className={cx(
          "dropdown__label",
          hideLabel && "dropdown__label--hidden",
        )}
      >
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        className="dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={onKeyDown}
      >
        <span className="dropdown__trigger-content">
          {triggerContent ?? selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className="dropdown__trigger-icon"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          className="dropdown__listbox"
          aria-labelledby={`${id}-label`}
          aria-activedescendant={
            highlighted >= 0 ? `${id}-opt-${highlighted}` : undefined
          }
        >
          {options.map((opt, i) => (
            <li
              key={opt.value}
              id={`${id}-opt-${i}`}
              role="option"
              className={cx(
                "dropdown__option",
                opt.value === value && "dropdown__option--selected",
                i === highlighted && "dropdown__option--highlighted",
                opt.disabled && "dropdown__option--disabled",
              )}
              aria-selected={opt.value === value}
              aria-disabled={opt.disabled}
              onClick={() => select(opt)}
              onMouseEnter={() => !opt.disabled && setHighlighted(i)}
            >
              <span className="dropdown__option-label">{opt.label}</span>
              {opt.description && (
                <span className="dropdown__option-description">
                  {opt.description}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={`${id}-error`} className="dropdown__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
