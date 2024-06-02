import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: ['verbose'],
    },
    coverage: {
      exclude: [
        '**/dist/**',
        '**/*.bench.ts',
        '**/*.bench-d.ts',
        '**/*.test.ts',
        '**/*.test-d.ts',
        'packages/abitype/src/version.ts',
      ],
      include: ['packages/abitype/src/**/*.ts'],
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
    },
  },
})
