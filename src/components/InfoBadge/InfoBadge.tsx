import "./InfoBadge.scss";

interface InfoBadgeProps {
  readonly children: React.ReactNode;
  readonly position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  readonly className?: string;
}

/*
 * Renders a floating status badge over the canvas.
 * Useful for showing contextual information such as the active grid cell.
 */
export function InfoBadge({
  children,
  position = "top-right",
  className = "",
}: InfoBadgeProps) {
  return (
    <div className={`info-badge info-badge--${position} ${className}`}>
      {children}
    </div>
  );
}
