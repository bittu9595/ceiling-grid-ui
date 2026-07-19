import { Button } from "../../../components";
import type { ToolConfig } from "../constants";

interface ToolButtonProps {
  readonly tool: ToolConfig;
  readonly isActive: boolean;
  readonly isCollapsed: boolean;
  readonly onClick: () => void;
}

export default function ToolButton({
  tool,
  isActive,
  isCollapsed,
  onClick,
}: ToolButtonProps) {
  const className = [
    "sidebar__tool",
    `sidebar__tool--${tool.type}`,
    isActive && "sidebar__tool--active",
  ]
    .filter(Boolean)
    .join(" ");

  const tooltip = tool.description;

  return (
    <Button
      variant="ghost"
      className={className}
      onClick={onClick}
      title={tooltip}
      aria-label={isCollapsed ? tool.label : undefined}
      data-testid={`tool-${tool.type}`}
    >
      <span className="sidebar__tool-icon">{tool.icon}</span>
      {!isCollapsed && (
        <span className="sidebar__tool-label">{tool.label}</span>
      )}
    </Button>
  );
}
