import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: ['verbose'],
    },
    coverage: {
      exclude: ['**/dist/**', '**/*.test.ts', '**/*.test-d.ts'],
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
    },
  },
})
