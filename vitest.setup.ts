import "@testing-library/jest-dom/vitest";

// jsdom lacks ResizeObserver; provide a simple stub for components that use it.
class ResizeObserverStub {
  private callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {
    this.callback([], this);
  }
  unobserve() {}
  disconnect() {}
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - extend the global scope in tests only.
if (!globalThis.ResizeObserver) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.ResizeObserver = ResizeObserverStub;
}

if (!Element.prototype.scrollIntoView) {
  // eslint-disable-next-line no-extend-native
  Element.prototype.scrollIntoView = () => {};
}

if (!Element.prototype.setPointerCapture) {
  // eslint-disable-next-line no-extend-native, @typescript-eslint/no-empty-function
  Element.prototype.setPointerCapture = () => {};
}

if (!Element.prototype.releasePointerCapture) {
  // eslint-disable-next-line no-extend-native, @typescript-eslint/no-empty-function
  Element.prototype.releasePointerCapture = () => {};
}

if (!globalThis.PointerEvent) {
  // Minimal PointerEvent shim for jsdom with configurable properties.
  class PointerEventShim extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      Object.defineProperty(this, "pointerId", {
        value: params.pointerId ?? 0,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(this, "pointerType", {
        value: params.pointerType ?? "mouse",
        configurable: true,
        writable: true,
      });
      Object.defineProperty(this, "buttons", {
        value: params.buttons ?? 0,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(this, "button", {
        value: params.button ?? 0,
        configurable: true,
        writable: true,
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - extend the global scope in tests only.
  globalThis.PointerEvent = PointerEventShim;
}
