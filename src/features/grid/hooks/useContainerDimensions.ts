import { useRef, useState, useCallback } from "react";

interface Dimensions {
  width: number;
  height: number;
}

const DEFAULT_DIMENSIONS: Dimensions = { width: 800, height: 600 };

export function useContainerDimensions(
  initialDimensions: Dimensions = DEFAULT_DIMENSIONS,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>(initialDimensions);

  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      containerRef.current = node;
      const { width, height } = node.getBoundingClientRect();
      setDimensions({ width, height });

      const observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      });
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, []);

  return { containerRef, dimensions, containerRefCallback };
}
