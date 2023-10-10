import path from 'path'
import { defineWorkspace } from 'vitest/config'

const resolve = {
  alias: {
    abitype: path.resolve(__dirname, '.packages/abitype/src'),
  },
}

export default defineWorkspace([
  {
    test: {
      name: 'abitype',
      environment: 'node',
      setupFiles: ['./packages/abitype/test/setup.ts'],
      include: ['./packages/abitype/**/*.test.ts'],
    },
  },
  {
    resolve,
    test: {
      name: 'default-register',
      environment: 'node',
      include: ['./packages/default-register/**/*.test.ts'],
    },
  },
])
