import { defineConfig } from 'tsup'

import packageJson from './package.json'

export default defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/zod/index.ts', 'src/config.ts'],
  external: [...Object.keys(packageJson.peerDependencies)],
  format: ['esm'],
  target: 'es2021',
})
