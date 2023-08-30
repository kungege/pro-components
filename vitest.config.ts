import path from 'path';
import React from 'react';
import type { UserConfig } from 'vitest/config';
import { defineConfig } from 'vitest/config';

const resolve = (dir: string) => path.resolve(__dirname, dir);

export const commonConfig: UserConfig = {
  esbuild: {
    jsx: React.version.startsWith('16') ? 'transform' : 'automatic',
  },
  resolve: {
    mainFields: ['module'],
    alias: [
      {
        find: '@ant-design/pro-components',
        replacement: resolve('packages/components/src/index'),
      },
      {
        find: '@ant-design/pro-card',
        replacement: resolve('packages/card/src/index'),
      },
      {
        find: '@ant-design/pro-descriptions',
        replacement: resolve('packages/descriptions/src/index'),
      },
      {
        find: '@ant-design/pro-field',
        replacement: resolve('packages/field/src/index'),
      },
      {
        find: '@ant-design/pro-form',
        replacement: resolve('packages/form/src/index'),
      },
      {
        find: '@ant-design/pro-layout',
        replacement: resolve('packages/layout/src/index'),
      },
      {
        find: '@ant-design/pro-list',
        replacement: resolve('packages/list/src/index'),
      },
      {
        find: '@ant-design/pro-provider',
        replacement: resolve('packages/provider/src/index'),
      },
      {
        find: '@ant-design/pro-skeleton',
        replacement: resolve('packages/skeleton/src/index'),
      },
      {
        find: '@ant-design/pro-table',
        replacement: resolve('packages/table/src/index'),
      },
      {
        find: '@ant-design/pro-utils',
        replacement: resolve('packages/utils/src/index'),
      },
    ],
  },
};

export default defineConfig({
  ...commonConfig,
  test: {
    testTimeout: 20000,
    maxThreads: 4,
    include: ['tests/descriptions/*.test.{ts,tsx}'],
    globals: true,
    setupFiles: ['./tests/setupTests.ts'],
    environment: 'jsdom',
    coverage: {
      include: ['tests/**/*.{ts,tsx}'],
    },
  },
});
