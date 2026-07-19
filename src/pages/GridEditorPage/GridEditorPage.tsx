import { useEffect } from "react";
import {
  CeilingGrid,
  ZoomControls,
  GridControls,
  GridStatsPanel,
} from "../../features/grid";
import { Sidebar } from "../../features/toolbar/Sidebar";
import "./GridEditorPage.scss";
import { useAppStore, useSetHeaderMenuSlot } from "../../store";

export default function GridEditorPage() {
  const isSidebarCollapsed = useAppStore(
    (state) => state.ui.isSidebarCollapsed,
  );

  // Register header menu slot for this page
  const setMenuSlot = useSetHeaderMenuSlot();
  useEffect(() => {
    setMenuSlot(GridControls);
    return () => setMenuSlot(null);
  }, [setMenuSlot]);

  const pageClasses = [
    "grid-editor-page",
    isSidebarCollapsed && "grid-editor-page--sidebar-collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={pageClasses}>
      <GridStatsPanel />
      <div className="grid-editor-page__main">
        <Sidebar />
        <div className="grid-editor-page__canvas-area">
          <CeilingGrid />
          <ZoomControls />
        </div>
      </div>
    </div>
  );
}
