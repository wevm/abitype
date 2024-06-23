import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup } from '@arktype/attest'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default function () {
  return setup({
    benchErrorOnThresholdExceeded: true,
    benchPercentThreshold: 10,
    tsconfig: resolve(__dirname, '../tsconfig.json'),
    formatter: 'pnpm biome format --write',
  })
}

// biome-ignore lint/performance/noBarrelFile: <explanation>
export { teardown } from '@arktype/attest'
