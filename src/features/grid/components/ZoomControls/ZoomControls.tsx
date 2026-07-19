import { Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "../../../../components";
import "./ZoomControls.scss";
import { useAppStore } from "../../../../store";

export function ZoomControls() {
  const viewport = useAppStore((state) => state.viewport);
  const zoomIn = useAppStore((state) => state.zoomIn);
  const zoomOut = useAppStore((state) => state.zoomOut);
  const resetZoom = useAppStore((state) => state.resetZoom);

  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <div className="zoom-controls" data-testid="zoom-controls">
      <Button
        variant="icon"
        size="sm"
        className="zoom-controls__btn"
        onClick={zoomIn}
        title="Zoom In (+)"
        disabled={viewport.zoom >= viewport.maxZoom}
        aria-label="Zoom in"
        data-testid="zoom-in"
      >
        <Plus size={18} aria-hidden="true" />
      </Button>

      <div
        className="zoom-controls__level"
        title="Current Zoom Level"
        data-testid="zoom-level"
      >
        {zoomPercent}%
      </div>

      <Button
        variant="icon"
        size="sm"
        className="zoom-controls__btn"
        onClick={zoomOut}
        title="Zoom Out (-)"
        disabled={viewport.zoom <= viewport.minZoom}
        aria-label="Zoom out"
        data-testid="zoom-out"
      >
        <Minus size={18} aria-hidden="true" />
      </Button>

      <div className="zoom-controls__divider" />

      <Button
        variant="icon"
        size="sm"
        className="zoom-controls__btn"
        onClick={resetZoom}
        title="Reset View"
        aria-label="Reset zoom"
        data-testid="zoom-reset"
      >
        <RotateCcw size={18} aria-hidden="true" />
      </Button>
    </div>
  );
}
