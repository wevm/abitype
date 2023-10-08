import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '~abitype': join(__dirname, '../src'),
      '~test': join(__dirname, '.'),
    },
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: ['verbose'],
    },
    coverage: {
      exclude: [
        '**/index.ts',
        '**/_cjs/**',
        '**/_esm/**',
        '**/_types/**',
        '**/*.test.ts',
        '**/test/**',
      ],
      reporter: ['text', 'json', 'html'],
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: [join(__dirname, './setup.ts')],
  },
})
