import { expect, test } from 'vitest'

import { seaport, uniswap, weth } from '../test/bytecodes'
import { parseBytecode } from './parseBytecode'
import { resolvedSelectors } from './runtime'

test('Invalid bytecode', () => {
  expect(() => parseBytecode('invalid')).toThrowErrorMatchingInlineSnapshot(`
    "Invalid bytecode

    Cannot infer any values from the provided bytecode string.

    Version: abitype@x.y.z"
  `)
})

test('parse weth bytecode', () => {
  const result = parseBytecode(weth)
  expect(result).toMatchSnapshot()
})

test('parse uniswap bytecode', () => {
  const result = parseBytecode(uniswap)
  expect(result).toMatchSnapshot()
})

test('parse seaport bytecode', () => {
  const result = parseBytecode(seaport)
  expect(result).toMatchSnapshot()
})

test('parse seaport bytecode with resolved selectors', () => {
  const result = parseBytecode(seaport, resolvedSelectors)
  expect(result).toMatchSnapshot()
})
