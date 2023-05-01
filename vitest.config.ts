import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: ['verbose'],
    },
    coverage: {
      exclude: ['**/_test/**', 'src/test/**', 'src/**/*.test.ts'],
      reporter: ['text', 'json', 'html'],
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/_test/setup.ts'],
  },
})
