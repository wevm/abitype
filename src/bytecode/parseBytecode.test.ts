import { expect, test } from 'vitest'

import {
  customBytecode,
  seaportBytecode,
  uniswapBytecode,
  wethBytecode,
} from '../test/bytecodes.js'
import { parseBytecode } from './parseBytecode.js'
import { resolvedSelectors } from './runtime/index.js'

test('Invalid bytecode', () => {
  expect(() => parseBytecode('invalid')).toThrowErrorMatchingInlineSnapshot(`
    "Invalid bytecode

    Cannot infer any values from the provided bytecode string.

    Version: abitype@x.y.z"
  `)
})

test('parse weth bytecode', () => {
  const result = parseBytecode(wethBytecode)
  expect(result).toMatchSnapshot()
})

test('parse uniswap bytecode', () => {
  const result = parseBytecode(uniswapBytecode)
  expect(result).toMatchSnapshot()
})

test('parse seaport bytecode', () => {
  const result = parseBytecode(seaportBytecode)
  expect(result).toMatchSnapshot()
})

test('parse seaport bytecode with resolved selectors', () => {
  const result = parseBytecode(seaportBytecode, resolvedSelectors)
  expect(result).toMatchSnapshot()
})

test('parse custom bytecode', () => {
  const result = parseBytecode(customBytecode)
  expect(result).toMatchSnapshot()
})

test('parse custom bytecode with resolvedSelectors', () => {
  const result = parseBytecode(customBytecode, resolvedSelectors)
  expect(result).toMatchSnapshot()
})
