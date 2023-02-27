import { defineConfig } from 'tsup'

import packageJson from './package.json'
import { getConfig } from './scripts/tsup'

export default defineConfig(
  getConfig({
    dev: process.env.DEV === 'true',
    entry: [
      'src/index.ts',
      'src/config.ts',
      'src/test/index.ts',
      'src/zod/index.ts',
    ],
    external: [...Object.keys(packageJson.peerDependencies)],
  }),
)
