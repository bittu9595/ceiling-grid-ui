import { COMPONENTS } from "../../constants";
import { useComponentStats } from "../../hooks";
import "./GridStatsPanel.scss";

export function GridStatsPanel() {
  const stats = useComponentStats();

  return (
    <div className="grid-stats-panel">
      {COMPONENTS.map(({ type, label }) => (
        <div
          key={type}
          className={`grid-stats-panel__stat grid-stats-panel__stat--${type}`}
        >
          <span className="grid-stats-panel__stat-dot" />
          {label} <strong>{stats[type]}</strong>
        </div>
      ))}
    </div>
  );
}
