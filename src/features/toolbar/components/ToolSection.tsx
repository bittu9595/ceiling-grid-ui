import type { ToolType } from "../../../types";
import type { ToolConfig } from "../constants";
import ToolButton from "./ToolButton";

interface ToolSectionProps {
  readonly title: string;
  readonly tools: readonly ToolConfig[];
  readonly selectedTool: ToolType;
  readonly isCollapsed: boolean;
  readonly onSelectTool: (tool: ToolType) => void;
}

/*
 * Groups related sidebar tools into a labeled section.
 * Renders the selection UI for a tool category.
 */
export default function ToolSection({
  title,
  tools,
  selectedTool,
  isCollapsed,
  onSelectTool,
}: ToolSectionProps) {
  return (
    <div className="sidebar__section">
      {!isCollapsed && <h3 className="sidebar__section-title">{title}</h3>}
      <div className="sidebar__tools">
        {tools.map((tool) => (
          <ToolButton
            key={tool.type}
            tool={tool}
            isActive={selectedTool === tool.type}
            isCollapsed={isCollapsed}
            onClick={() => onSelectTool(tool.type)}
          />
        ))}
      </div>
    </div>
  );
}
