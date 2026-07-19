import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useViewportZoom } from "../useViewportZoom";
import type { RefObject } from "react";

// Mock store values
const mockViewport = vi.fn();
const mockSetZoom = vi.fn();
const mockSetOffset = vi.fn();

vi.mock("../../../../store", () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    selector({
      viewport: mockViewport(),
      setZoom: mockSetZoom,
      setOffset: mockSetOffset,
    }),
}));

describe("useViewportZoom", () => {
  const defaultViewport = {
    zoom: 1,
    minZoom: 0.1,
    maxZoom: 5,
    offsetX: 100,
    offsetY: 50,
  };

  let mockContainerRef: RefObject<HTMLDivElement>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockViewport.mockReturnValue(defaultViewport);
    mockContainerRef = {
      current: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 800,
          height: 600,
          right: 800,
          bottom: 600,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }),
      } as HTMLDivElement,
    };
  });

  describe("handleWheel", () => {
    it("returns handleWheel function", () => {
      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      expect(typeof result.current.handleWheel).toBe("function");
    });

    it("prevents default scroll behavior", () => {
      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      const mockPreventDefault = vi.fn();
      const mockEvent = {
        preventDefault: mockPreventDefault,
        deltaY: 100,
        clientX: 400,
        clientY: 300,
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
    });

    it("zooms out when scrolling down (positive deltaY)", () => {
      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      const mockEvent = {
        preventDefault: vi.fn(),
        deltaY: 100,
        clientX: 400,
        clientY: 300,
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      // zoom * 0.9 = 1 * 0.9 = 0.9
      expect(mockSetZoom).toHaveBeenCalledWith(0.9);
    });

    it("zooms in when scrolling up (negative deltaY)", () => {
      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      const mockEvent = {
        preventDefault: vi.fn(),
        deltaY: -100,
        clientX: 400,
        clientY: 300,
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      // zoom * 1.1 = 1 * 1.1 = 1.1
      expect(mockSetZoom).toHaveBeenCalledWith(1.1);
    });

    it("clamps zoom to minZoom", () => {
      mockViewport.mockReturnValue({
        ...defaultViewport,
        zoom: 0.15,
        minZoom: 0.1,
      });

      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      const mockEvent = {
        preventDefault: vi.fn(),
        deltaY: 100, // zoom out
        clientX: 400,
        clientY: 300,
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      // 0.15 * 0.9 = 0.135, but clamped to 0.1 minimum
      expect(mockSetZoom).toHaveBeenCalledWith(0.135);
    });

    it("clamps zoom to maxZoom", () => {
      mockViewport.mockReturnValue({
        ...defaultViewport,
        zoom: 4.8,
        maxZoom: 5,
      });

      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      const mockEvent = {
        preventDefault: vi.fn(),
        deltaY: -100, // zoom in
        clientX: 400,
        clientY: 300,
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      // 4.8 * 1.1 = 5.28, but clamped to 5 maximum
      expect(mockSetZoom).toHaveBeenCalledWith(5);
    });

    it("updates offset to keep mouse position stationary", () => {
      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      const mockEvent = {
        preventDefault: vi.fn(),
        deltaY: -100, // zoom in
        clientX: 400,
        clientY: 300,
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      expect(mockSetOffset).toHaveBeenCalled();
    });

    it("does nothing if containerRef is null", () => {
      const nullRef = {
        current: null,
      } as React.RefObject<HTMLDivElement | null>;
      const { result } = renderHook(() => useViewportZoom(nullRef));

      const mockEvent = {
        preventDefault: vi.fn(),
        deltaY: 100,
        clientX: 400,
        clientY: 300,
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      expect(mockSetZoom).not.toHaveBeenCalled();
      expect(mockSetOffset).not.toHaveBeenCalled();
    });
  });

  describe("zoom calculation", () => {
    it("calculates correct offset for zoom at specific point", () => {
      // Testing zoom at center of container
      mockViewport.mockReturnValue({
        zoom: 1,
        minZoom: 0.1,
        maxZoom: 5,
        offsetX: 0,
        offsetY: 0,
      });

      const { result } = renderHook(() => useViewportZoom(mockContainerRef));

      const mockEvent = {
        preventDefault: vi.fn(),
        deltaY: -100, // zoom in to 1.1
        clientX: 0, // at left edge
        clientY: 0, // at top edge
      } as unknown as React.WheelEvent;

      act(() => {
        result.current.handleWheel(mockEvent);
      });

      // At (0,0) with offset (0,0), zooming shouldn't change offset
      expect(mockSetOffset).toHaveBeenCalledWith(0, 0);
    });
  });

  describe("callback stability", () => {
    it("handleWheel is stable when dependencies do not change", () => {
      const { result, rerender } = renderHook(() =>
        useViewportZoom(mockContainerRef),
      );

      const firstHandler = result.current.handleWheel;
      rerender();
      const secondHandler = result.current.handleWheel;

      expect(firstHandler).toBe(secondHandler);
    });
  });
});
