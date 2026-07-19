import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useContainerDimensions } from "../useContainerDimensions";

describe("useContainerDimensions", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: ResizeObserverCallback;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    globalThis.ResizeObserver = class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        observerCallback = callback;
      }
      observe = mockObserve;
      unobserve = vi.fn();
      disconnect = mockDisconnect;
    } as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("returns default dimensions when no initial dimensions provided", () => {
      const { result } = renderHook(() => useContainerDimensions());

      expect(result.current.dimensions).toEqual({ width: 800, height: 600 });
    });

    it("returns custom initial dimensions when provided", () => {
      const { result } = renderHook(() =>
        useContainerDimensions({ width: 1024, height: 768 }),
      );

      expect(result.current.dimensions).toEqual({ width: 1024, height: 768 });
    });
  });

  describe("containerRef", () => {
    it("provides a containerRef", () => {
      const { result } = renderHook(() => useContainerDimensions());

      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });
  });

  describe("containerRefCallback", () => {
    it("provides a containerRefCallback function", () => {
      const { result } = renderHook(() => useContainerDimensions());

      expect(typeof result.current.containerRefCallback).toBe("function");
    });

    it("updates dimensions when node is provided", () => {
      const { result } = renderHook(() => useContainerDimensions());

      const mockNode = {
        getBoundingClientRect: () => ({
          width: 500,
          height: 400,
          top: 0,
          left: 0,
          right: 500,
          bottom: 400,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }),
      } as HTMLDivElement;

      act(() => {
        result.current.containerRefCallback(mockNode);
      });

      expect(result.current.dimensions).toEqual({ width: 500, height: 400 });
    });

    it("sets up ResizeObserver when node is provided", () => {
      const { result } = renderHook(() => useContainerDimensions());

      const mockNode = {
        getBoundingClientRect: () => ({
          width: 500,
          height: 400,
          top: 0,
          left: 0,
          right: 500,
          bottom: 400,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }),
      } as HTMLDivElement;

      act(() => {
        result.current.containerRefCallback(mockNode);
      });

      expect(mockObserve).toHaveBeenCalledWith(mockNode);
    });

    it("does nothing when null node is provided", () => {
      const { result } = renderHook(() => useContainerDimensions());

      act(() => {
        result.current.containerRefCallback(null);
      });

      expect(mockObserve).not.toHaveBeenCalled();
    });
  });

  describe("resize observer updates", () => {
    it("updates dimensions when resize observer fires", () => {
      const { result } = renderHook(() => useContainerDimensions());

      const mockNode = {
        getBoundingClientRect: () => ({
          width: 500,
          height: 400,
          top: 0,
          left: 0,
          right: 500,
          bottom: 400,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }),
      } as HTMLDivElement;

      act(() => {
        result.current.containerRefCallback(mockNode);
      });

      // Simulate resize
      act(() => {
        observerCallback(
          [
            {
              contentRect: { width: 600, height: 500 },
            } as ResizeObserverEntry,
          ],
          {} as ResizeObserver,
        );
      });

      expect(result.current.dimensions).toEqual({ width: 600, height: 500 });
    });
  });
});
