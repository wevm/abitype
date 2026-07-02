import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    ignorePatterns: [
      '**/.vocs',
      '**/CHANGELOG.md',
      '**/dist',
      '**/node_modules',
      'pnpm-lock.yaml',
      'trace',
      '**/tsconfig.json',
      '**/tsconfig.*.json',
    ],
    printWidth: 80,
    semi: false,
    singleQuote: true,
  },
  lint: {
    categories: {
      correctness: 'error',
    },
    ignorePatterns: ['**/.vocs', '**/dist', '**/node_modules'],
    overrides: [
      {
        files: [
          '**/*.bench.ts',
          '**/*.bench-d.ts',
          'playgrounds/performance/**',
        ],
        rules: {
          'no-unused-expressions': 'off',
        },
      },
    ],
    rules: {
      'no-unused-vars': 'error',
      'oxc/no-barrel-file': 'error',
      'typescript/no-non-null-asserted-optional-chain': 'off',
    },
  },
  staged: {
    '*': 'vp check --fix --no-error-on-unmatched-pattern',
  },
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
        'src/exports/**',
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
