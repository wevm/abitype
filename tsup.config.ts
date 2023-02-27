import { defineConfig } from 'tsup'

import packageJson from './package.json'
import { getConfig } from './scripts/tsup'

export default defineConfig(
  getConfig({
    entry: [
      'src/index.ts',
      'src/test/index.ts',
      'src/zod/index.ts',
      'src/config.ts',
    ],
    external: [...Object.keys(packageJson.peerDependencies)],
  }),
)
