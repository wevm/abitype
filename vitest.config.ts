import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    benchmark: {
      outputFile: 'bench/report.json',
      reporters: ['verbose'],
    },
    coverage: {
      exclude: ['**/_test/**', 'src/test/**'],
      reporter: ['text', 'json', 'html'],
    },
    environment: 'node',
    include: ['src/**/*.test.ts', 'examples/*.test.ts'],
    setupFiles: ['./src/_test/setup.ts'],
  },
})
