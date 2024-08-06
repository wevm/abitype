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
        '**/*.bench-d.ts',
        '**/*.test.ts',
        '**/*.test-d.ts',
        'src/version.ts',
      ],
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
    },
    environment: 'node',
    globalSetup: process.env.TYPES ? ['./test/globalSetup.ts'] : undefined,
    include: [
      ...(process.env.TYPES ? ['**/*.bench-d.ts'] : []),
      '**/*.test.ts',
    ],
    root: './packages/abitype',
    setupFiles: ['./test/setup.ts'],
  },
})
