import { InvalidBytecodeError } from './invalidBytecode'
import { expect, test } from 'vitest'

test('InvalidBytecodeError', () => {
  expect(new InvalidBytecodeError()).toMatchInlineSnapshot(`
    [InvalidBytecodeError: Invalid bytecode

    Cannot infer any values from the provided bytecode string.

    Version: abitype@x.y.z]
  `)
})
