import { MousePointer2, Hand, Eraser } from "lucide-react";
import type { ToolType } from "../../../types";
import { CEILING_COMPONENTS, TOOL_TYPES } from "../../../constants/ceiling-components";

export interface ToolConfig {
  readonly type: ToolType;
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly description: string;
  readonly shortcut?: string;
  readonly category: "drafting" | "component" | "action";
}

/** Base tools (non-component) */
const BASE_TOOLS: readonly ToolConfig[] = [
  {
    type: TOOL_TYPES.SELECT,
    icon: <MousePointer2 size={20} />,
    label: "Select",
    description: "Select to drag components",
    shortcut: "V",
    category: "drafting",
  },
  {
    type: TOOL_TYPES.PAN,
    icon: <Hand size={20} />,
    label: "Pan",
    description: "Pan to move the grid view",
    shortcut: "H",
    category: "drafting",
  },
];

/** Component tools derived from CEILING_COMPONENTS */
const COMPONENT_TOOLS: readonly ToolConfig[] = CEILING_COMPONENTS.map(
  (comp) => ({
    type: comp.type as ToolType,
    icon: comp.icon,
    label: comp.label,
    description: comp.description,
    category: "component" as const,
  }),
);

/** Action tools */
const ACTION_TOOLS: readonly ToolConfig[] = [
  {
    type: TOOL_TYPES.ERASER,
    icon: <Eraser size={20} />,
    label: "Eraser",
    description: "Click to remove components",
    shortcut: "E",
    category: "action",
  },
];

/** All tools combined */
export const TOOLS: readonly ToolConfig[] = [
  ...BASE_TOOLS,
  ...COMPONENT_TOOLS,
  ...ACTION_TOOLS,
];
