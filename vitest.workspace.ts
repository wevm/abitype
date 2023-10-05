import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/register-tests/*',
  {
    test: {
      name: 'abitype',
      environment: 'node',
      setupFiles: ['./packages/abitype/test/setup.ts'],
    },
  },
])
