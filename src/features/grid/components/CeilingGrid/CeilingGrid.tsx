import { useMemo } from "react";
import { Stage, Layer } from "react-konva";

import {
  BASE_CELL_SIZE,
  VIRTUALIZATION_BUFFER,
  formatCellInfo,
} from "../../constants";
import { TOOL_TYPES } from "../../../../constants/ceiling-components";
import { GridBackground, GridLines, GridCell, HoverPreview } from "./layers";
import "./CeilingGrid.scss";
import { GridFooter } from "../GridFooter/GridFooter";
import {
  useContainerDimensions,
  useGridInteractions,
  useViewportZoom,
} from "../../hooks";
import { useAppStore } from "../../../../store";
import { InfoBadge } from "../../../../components";

export function CeilingGrid() {
  const grid = useAppStore((state) => state.grid);
  const viewport = useAppStore((state) => state.viewport);
  const selectedTool = useAppStore((state) => state.ui.selectedTool);
  const selectedComponent = useAppStore((state) => state.ui.selectedComponent);

  const cellSize = BASE_CELL_SIZE * viewport.zoom;

  const { containerRef, dimensions, containerRefCallback } =
    useContainerDimensions();
  const { handleWheel } = useViewportZoom(containerRef);
  const {
    hoverCell,
    dragTarget,
    handleStageClick,
    handleStageMouseMove,
    handleStageMouseLeave,
    handleCellSelect,
    handleCellDragStart,
    handleCellDragEnd,
    handleStageDragEnd,
  } = useGridInteractions({ cellSize });

  // Cursor style
  const cursorClass = useMemo(() => {
    if (selectedTool === TOOL_TYPES.PAN) return "cursor-grab";
    if (selectedTool === TOOL_TYPES.SELECT) return "cursor-pointer";
    return "cursor-crosshair";
  }, [selectedTool]);

  // Virtualization: only render visible components (memoized for performance)
  const visibleComponents = useMemo(
    () =>
      Object.values(grid.components).filter((comp) => {
        const xOrigin = viewport.offsetX + comp.position.col * cellSize;
        const yOrigin = viewport.offsetY + comp.position.row * cellSize;
        return (
          xOrigin > -cellSize - VIRTUALIZATION_BUFFER &&
          xOrigin < dimensions.width + VIRTUALIZATION_BUFFER &&
          yOrigin > -cellSize - VIRTUALIZATION_BUFFER &&
          yOrigin < dimensions.height + VIRTUALIZATION_BUFFER
        );
      }),
    [
      grid.components,
      viewport.offsetX,
      viewport.offsetY,
      cellSize,
      dimensions.width,
      dimensions.height,
    ],
  );

  return (
    <div
      ref={containerRefCallback}
      className={`ceiling-grid ${cursorClass}`}
      onWheel={handleWheel}
      onContextMenu={(event) => event.preventDefault()}
      data-testid="ceiling-grid"
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        draggable={selectedTool === TOOL_TYPES.PAN && !dragTarget}
        onDragEnd={handleStageDragEnd}
      >
        <Layer listening={false}>
          <GridBackground
            width={dimensions.width}
            height={dimensions.height}
            offsetX={viewport.offsetX}
            offsetY={viewport.offsetY}
            gridWidth={grid.width}
            gridHeight={grid.height}
            cellSize={cellSize}
          />
          <GridLines
            offsetX={viewport.offsetX}
            offsetY={viewport.offsetY}
            gridWidth={grid.width}
            gridHeight={grid.height}
            cellSize={cellSize}
          />
        </Layer>

        <Layer>
          {visibleComponents.map((component) => (
            <GridCell
              key={component.id}
              component={component}
              offsetX={viewport.offsetX}
              offsetY={viewport.offsetY}
              cellSize={cellSize}
              isSelected={selectedComponent?.id === component.id}
              onSelect={handleCellSelect}
              onDragStart={handleCellDragStart}
              onDragEnd={handleCellDragEnd}
            />
          ))}
        </Layer>

        <Layer>
          {hoverCell && selectedTool !== TOOL_TYPES.PAN && (
            <HoverPreview
              row={hoverCell.row}
              col={hoverCell.col}
              offsetX={viewport.offsetX}
              offsetY={viewport.offsetY}
              cellSize={cellSize}
              selectedTool={selectedTool}
            />
          )}
        </Layer>
      </Stage>

      {/* Position indicator */}
      {hoverCell && selectedTool !== TOOL_TYPES.PAN && (
        <InfoBadge>{formatCellInfo(hoverCell.col, hoverCell.row)}</InfoBadge>
      )}

      <GridFooter
        width={grid.width}
        height={grid.height}
        componentCount={Object.keys(grid.components).length}
      />
    </div>
  );
}
