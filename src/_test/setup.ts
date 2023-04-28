import { vi } from 'vitest'

vi.mock('../version.ts', () => {
  return {
    version: 'x.y.z',
  }
})
