import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
  window.dataLayer = [];
});

// Polyfill window.scrollTo if missing in jsdom
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

// Polyfill window.matchMedia if missing in jsdom
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
