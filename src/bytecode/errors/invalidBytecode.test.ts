import { InvalidBytecodeError } from './invalidBytecode.js'
import { expect, test } from 'vitest'

test('InvalidBytecodeError', () => {
  expect(new InvalidBytecodeError()).toMatchInlineSnapshot(`
    [InvalidBytecodeError: Invalid bytecode

    Cannot infer any values from the provided bytecode string.

    Version: abitype@x.y.z]
  `)
})
