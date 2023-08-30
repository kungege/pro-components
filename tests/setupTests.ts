import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import matchers from '@testing-library/jest-dom/matchers';
import { defaultConfig } from 'antd/lib/theme/internal';
import MockDate from 'mockdate';
import { expect, vi } from 'vitest';

defaultConfig.hashed = false;

declare module 'vitest' {
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {
    toHaveNoViolations(): void;
  }
}

expect.extend(matchers);

process.env.TZ = 'UTC';

const originConsoleErr = console.error;

// Hack off React warning to avoid too large log in CI.
console.error = (...args) => {
  const str = args.join('').replace(/\n/g, '');

  if (
    [
      'validateDOMNesting',
      'on an unmounted component',
      'not wrapped in act',
    ].every((warn) => !str.includes(warn))
  ) {
    originConsoleErr(...args);
  }
};

/* eslint-disable global-require */
if (typeof window !== 'undefined') {
  globalThis.window.resizeTo = (width, height) => {
    globalThis.window.innerWidth = width || globalThis.window.innerWidth;
    globalThis.window.innerHeight = height || globalThis.window.innerHeight;
    globalThis.window.dispatchEvent(new Event('resize'));
  };
  globalThis.window.scrollTo = () => {};
  // ref: https://github.com/ant-design/ant-design/issues/18774
  if (!window.matchMedia) {
    Object.defineProperty(globalThis.window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query) => ({
        matches: query.includes('max-width'),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  }
}

Object.defineProperty(window, 'open', {
  value: vi.fn,
});

const crypto = require('crypto');
Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr: any[]) => crypto.randomBytes(arr.length),
  },
});

global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function requestAnimationFrame(cb) {
    return setTimeout(cb, 0);
  };

global.cancelAnimationFrame =
  global.cancelAnimationFrame ||
  function cancelAnimationFrame() {
    return null;
  };

// browserMocks.js
export const localStorageMock = (() => {
  let store: any = {
    umi_locale: 'zh-CN',
  };

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      store[key] = null;
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: () => null,
});

// 2016-11-22 15:22:44
MockDate.set(1479828164000);

Math.random = () => 0.8404419276253765;

// @ts-ignore-next-line
global.Worker = class {
  constructor(stringUrl: string) {
    // @ts-ignore-next-line
    this.url = stringUrl;
    // @ts-ignore-next-line
    this.onmessage = () => {};
  }

  postMessage(msg: string) {
    // @ts-ignore-next-line
    this.onmessage(msg);
  }
};

if (process.env.TEST_LOG === 'none') {
  console.error = () => {};
  console.warn = () => {};
  console.log = () => {};
}
// with jest-canvas-mock
(globalThis as any).jest = vi;
await import('jest-canvas-mock');
