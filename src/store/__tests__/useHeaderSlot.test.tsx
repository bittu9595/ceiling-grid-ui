import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useHeaderMenuSlot, useSetHeaderMenuSlot } from "../useHeaderSlot";

describe("useHeaderSlot", () => {
  describe("useHeaderMenuSlot", () => {
    it("returns null MenuComponent initially", () => {
      const { result } = renderHook(() => useHeaderMenuSlot());
      expect(result.current.MenuComponent).toBeNull();
    });

    it("returns MenuComponent after it is set", () => {
      const TestComponent = () => <div>Test</div>;

      const { result: setResult } = renderHook(() => useSetHeaderMenuSlot());
      const { result: getResult } = renderHook(() => useHeaderMenuSlot());

      act(() => {
        setResult.current(TestComponent);
      });

      expect(getResult.current.MenuComponent).toBe(TestComponent);
    });
  });

  describe("useSetHeaderMenuSlot", () => {
    it("returns a function", () => {
      const { result } = renderHook(() => useSetHeaderMenuSlot());
      expect(typeof result.current).toBe("function");
    });

    it("can set a component", () => {
      const TestComponent = () => <div>Test</div>;

      const { result: setResult } = renderHook(() => useSetHeaderMenuSlot());
      const { result: getResult } = renderHook(() => useHeaderMenuSlot());

      act(() => {
        setResult.current(TestComponent);
      });

      expect(getResult.current.MenuComponent).toBe(TestComponent);
    });

    it("can clear the component by setting null", () => {
      const TestComponent = () => <div>Test</div>;

      const { result: setResult } = renderHook(() => useSetHeaderMenuSlot());
      const { result: getResult } = renderHook(() => useHeaderMenuSlot());

      act(() => {
        setResult.current(TestComponent);
      });

      act(() => {
        setResult.current(null);
      });

      expect(getResult.current.MenuComponent).toBeNull();
    });

    it("replaces existing component", () => {
      const Component1 = () => <div>One</div>;
      const Component2 = () => <div>Two</div>;

      const { result: setResult } = renderHook(() => useSetHeaderMenuSlot());
      const { result: getResult } = renderHook(() => useHeaderMenuSlot());

      act(() => {
        setResult.current(Component1);
      });

      act(() => {
        setResult.current(Component2);
      });

      expect(getResult.current.MenuComponent).toBe(Component2);
    });
  });

  describe("integration", () => {
    it("multiple consumers see the same value", () => {
      const TestComponent = () => <div>Test</div>;

      const { result: setResult } = renderHook(() => useSetHeaderMenuSlot());
      const { result: getResult1 } = renderHook(() => useHeaderMenuSlot());
      const { result: getResult2 } = renderHook(() => useHeaderMenuSlot());

      act(() => {
        setResult.current(TestComponent);
      });

      expect(getResult1.current.MenuComponent).toBe(TestComponent);
      expect(getResult2.current.MenuComponent).toBe(TestComponent);
    });
  });
});
