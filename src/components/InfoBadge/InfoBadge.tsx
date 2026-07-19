import "./InfoBadge.scss";

interface InfoBadgeProps {
  readonly children: React.ReactNode;
  readonly position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  readonly className?: string;
}

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
