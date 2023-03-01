import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: ['verbose'],
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/_test/**'],
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/_test/setup.ts'],
  },
})
