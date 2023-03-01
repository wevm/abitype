import { vi } from 'vitest'

vi.mock('../../package.json', async () => {
  const packageJson = await vi.importActual('../../package.json')
  return {
    ...(packageJson as { [_: string]: unknown }),
    version: 'x.y.z',
  }
})
