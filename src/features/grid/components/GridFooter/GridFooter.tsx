import "./GridFooter.scss";

interface GridFooterProps {
  readonly width: number;
  readonly height: number;
  readonly componentCount: number;
}

export function GridFooter({ width, height, componentCount }: GridFooterProps) {
  return (
    <footer className="grid-footer">
      <div className="grid-footer__left">
        <span className="grid-footer__tiles">
          {width}×{height} tiles ({(width * height).toLocaleString()} cells)
        </span>
        <span className="grid-footer__placed">Placed: {componentCount}</span>
      </div>
      <div className="grid-footer__right">
        Scroll to zoom · Space or middle-drag to pan · Select tool to drag
        components
      </div>
    </footer>
  );
}
