import { assertType, expect, expectTypeOf, test } from 'vitest'

import { formatAbiParameter } from './formatAbiParameter.js'

test('default', () => {
  const result = formatAbiParameter({ type: 'address', name: 'foo' })
  expect(result).toEqual('address foo')
  expectTypeOf(result).toEqualTypeOf<'address foo'>()
})

test('tuple', () => {
  const result = formatAbiParameter({
    type: 'tuple',
    components: [
      { type: 'string', name: 'bar' },
      { type: 'string', name: 'baz' },
    ],
    name: 'foo',
  })
  expect(result).toMatchInlineSnapshot('"(string bar, string baz) foo"')
  expectTypeOf(result).toEqualTypeOf<'(string bar, string baz) foo'>()
})

test('tuple[][]', () => {
  const result = formatAbiParameter({
    type: 'tuple[123][]',
    components: [
      { type: 'string', name: 'bar' },
      { type: 'string', name: 'baz' },
    ],
    name: 'foo',
  })
  expect(result).toMatchInlineSnapshot('"(string bar, string baz)[123][] foo"')
  expectTypeOf(result).toEqualTypeOf<'(string bar, string baz)[123][] foo'>()
})

test.each([
  {
    abiParameter: { type: 'string' },
    expected: 'string',
  },
  {
    abiParameter: { name: 'foo', type: 'string' },
    expected: 'string foo',
  },
  {
    abiParameter: { name: 'foo', type: 'string', indexed: true },
    expected: 'string indexed foo',
  },
  {
    abiParameter: { type: 'tuple', components: [{ type: 'string' }] },
    expected: '(string)',
  },
  {
    abiParameter: {
      type: 'tuple',
      components: [{ name: 'foo', type: 'string' }],
    },
    expected: '(string foo)',
  },
  {
    abiParameter: {
      type: 'tuple',
      name: 'foo',
      components: [{ name: 'bar', type: 'string' }],
    },
    expected: '(string bar) foo',
  },
  {
    abiParameter: {
      type: 'tuple',
      name: 'foo',
      components: [
        { name: 'bar', type: 'string' },
        { name: 'baz', type: 'string' },
      ],
    },
    expected: '(string bar, string baz) foo',
  },
  {
    abiParameter: { type: 'string', indexed: false },
    expected: 'string',
  },
  {
    abiParameter: { type: 'string', indexed: true },
    expected: 'string indexed',
  },
  {
    abiParameter: { type: 'string', indexed: true, name: 'foo' },
    expected: 'string indexed foo',
  },
])('formatAbiParameter($abiParameter)', ({ abiParameter, expected }) => {
  expect(formatAbiParameter(abiParameter)).toEqual(expected)
})

test('nested tuple', () => {
  const result = formatAbiParameter({
    components: [
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    name: 'baz',
                    type: 'string',
                  },
                ],
                name: 'bar',
                type: 'tuple',
              },
            ],
            name: 'foo',
            type: 'tuple[1]',
          },
        ],
        name: 'boo',
        type: 'tuple',
      },
    ],
    type: 'tuple',
  })
  expect(result).toMatchInlineSnapshot('"((((string baz) bar)[1] foo) boo)"')
  assertType<'((((string baz) bar)[1] foo) boo)'>(result)
})
