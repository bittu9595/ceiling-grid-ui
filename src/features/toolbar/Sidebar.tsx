import { useMemo } from "react";
import { Trash2, ChevronLeft, Menu } from "lucide-react";
import { Button } from "../../components";
import { TOOLS } from "./constants";
import "./Sidebar.scss";
import ToolSection from "./components/ToolSection";
import ToolButton from "./components/ToolButton";
import { useAppStore } from "../../store";

/*
 * Renders the left-side tool sidebar.
 * Organizes drafting, component, and action tools for the editor.
 */
export function Sidebar() {
  const selectedTool = useAppStore((state) => state.ui.selectedTool);
  const isCollapsed = useAppStore((state) => state.ui.isSidebarCollapsed);
  const selectTool = useAppStore((state) => state.selectTool);
  const clearGrid = useAppStore((state) => state.clearGrid);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const { draftingTools, componentTools, actionTools } = useMemo(
    () => ({
      draftingTools: TOOLS.filter((tool) => tool.category === "drafting"),
      componentTools: TOOLS.filter((tool) => tool.category === "component"),
      actionTools: TOOLS.filter((tool) => tool.category === "action"),
    }),
    [],
  );

  return (
    <aside
      className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`}
      data-testid="sidebar"
    >
      <div className="sidebar__header-row">
        {isCollapsed ? (
          <div className="sidebar__header-collapsed">
            <Button
              variant="icon"
              onClick={toggleSidebar}
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <Menu size={20} />
            </Button>
          </div>
        ) : (
          <div className="sidebar__header">
            <h2 className="sidebar__title">AeroGrid Architect</h2>
            <p className="sidebar__subtitle">Component Library</p>
          </div>
        )}
        {!isCollapsed && (
          <Button
            variant="icon"
            className="sidebar__toggle"
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>

      <div className="sidebar__content">
        <ToolSection
          title="Drafting Tools"
          tools={draftingTools}
          selectedTool={selectedTool}
          isCollapsed={isCollapsed}
          onSelectTool={selectTool}
        />

        <ToolSection
          title="Components"
          tools={componentTools}
          selectedTool={selectedTool}
          isCollapsed={isCollapsed}
          onSelectTool={selectTool}
        />

        <div className="sidebar__section">
          {!isCollapsed && <h3 className="sidebar__section-title">Actions</h3>}
          <div className="sidebar__tools">
            {actionTools.map((tool) => (
              <ToolButton
                key={tool.type}
                tool={tool}
                isActive={selectedTool === tool.type}
                isCollapsed={isCollapsed}
                onClick={() => selectTool(tool.type)}
              />
            ))}
            <Button
              variant="ghost"
              className="sidebar__tool sidebar__tool--danger"
              onClick={clearGrid}
              title="Clear All"
              aria-label={isCollapsed ? "Clear All" : undefined}
            >
              <span className="sidebar__tool-icon">
                <Trash2 size={20} />
              </span>
              {!isCollapsed && (
                <span className="sidebar__tool-label">Clear All</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
