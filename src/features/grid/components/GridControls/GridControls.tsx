import { useId, useMemo } from "react";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { COMPONENTS, GRID_PRESETS } from "../../constants";
import { useComponentStats, useGridSizeControls } from "../../hooks";
import "./GridControls.scss";
import { useAppStore } from "../../../../store";

/*
 * Renders the grid size and component stats controls.
 * Lets users modify dimensions, choose presets, and inspect component totals.
 */
export function GridControls() {
  const grid = useAppStore((state) => state.grid);
  const widthId = useId();
  const heightId = useId();
  const stats = useComponentStats();

  const {
    customWidth,
    customHeight,
    setCustomWidth,
    setCustomHeight,
    handlePresetSelect,
    handleCustomSize,
    handleKeyDown,
  } = useGridSizeControls();

  const presetOptions = useMemo(
    () =>
      GRID_PRESETS.map((preset) => ({
        value: `${preset.width}x${preset.height}`,
        label: preset.label,
      })),
    [],
  );

  const currentPresetValue = useMemo(() => {
    const match = GRID_PRESETS.find(
      (p) => p.width === grid.width && p.height === grid.height,
    );
    return match ? `${match.width}x${match.height}` : "";
  }, [grid.width, grid.height]);

  return (
    <div className="grid-controls">
      <div className="grid-controls__dimensions">
        <div className="grid-controls__field">
          <label htmlFor={widthId} className="grid-controls__label">
            WIDTH
          </label>
          <input
            id={widthId}
            type="number"
            className="grid-controls__input"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            onBlur={handleCustomSize}
            onKeyDown={handleKeyDown}
            min={1}
            max={2000}
          />
        </div>
        <div className="grid-controls__field">
          <label htmlFor={heightId} className="grid-controls__label">
            HEIGHT
          </label>
          <input
            id={heightId}
            type="number"
            className="grid-controls__input"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            onBlur={handleCustomSize}
            onKeyDown={handleKeyDown}
            min={1}
            max={2000}
          />
        </div>
      </div>

      <Dropdown
        label="DIMENSIONS"
        options={presetOptions}
        value={currentPresetValue}
        placeholder={`Custom ${grid.width}×${grid.height}`}
        onChange={handlePresetSelect}
        className="grid-controls__preset-dropdown"
      />

      <div className="grid-controls__stats">
        {COMPONENTS.map(({ type, label }) => (
          <div
            key={type}
            className={`grid-controls__stat grid-controls__stat--${type}`}
          >
            <span className="grid-controls__stat-dot" />
            {label} <strong>{stats[type]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
