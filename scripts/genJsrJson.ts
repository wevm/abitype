import fs from 'node:fs/promises'

// Generates jsr.json

console.log('Generating jsr.json')

await fs.writeFile(
  'packages/abitype/jsr.json',
  `${JSON.stringify(
    {
      name: '@wevm/abitype',
      version: '1.1.0',
      license: 'MIT',
      exports: {
        '.': './src/exports/index.ts',
        './abis': './src/exports/abis.ts',
        './zod': './src/exports/zod.ts',
      },
      publish: {
        include: ['LICENSE', 'README.md', 'CHANGELOG.md', 'src/**/*.ts'],
        exclude: [
          'src/**/*.bench.ts',
          'src/**/*.bench-d.ts',
          'src/**/*.test.ts',
          'src/**/*.test-d.ts',
        ],
      },
    },
    undefined,
    2,
  )}\n`,
  'utf-8',
)

console.log('Done.')
