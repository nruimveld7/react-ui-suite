import "@testing-library/jest-dom/vitest";

// jsdom lacks ResizeObserver; provide a simple stub for components that use it.
class ResizeObserverStub {
  observe() {}
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
