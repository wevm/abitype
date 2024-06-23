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
        '**/test/**',
        '**/*.bench.ts',
        '**/*.test.ts',
        '**/*.test-d.ts',
        'src/version.ts',
      ],
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
    },
    environment: 'node',
    globalSetup: ['./test/globalSetup.ts'],
    root: './packages/abitype',
    setupFiles: ['./test/setup.ts'],
  },
})
