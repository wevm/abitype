import { assertType, test } from 'vitest'

import type { ResolveStructs } from './struct'

test('ResolveStructs', () => {
  type Result = ResolveStructs<
    [{ type: 'Name'; name: 'name' }],
    {
      Person: [{ type: 'Name'; name: 'name' }]
      Name: [{ type: 'Foo'; name: 'foo' }]
      Foo: [{ type: 'string'; name: 'bar' }, { type: 'uint16'; name: 'baz' }]
    }
  >
  assertType<Result>([
    {
      type: 'tuple',
      name: 'name',
      components: [
        {
          type: 'tuple',
          name: 'foo',
          components: [
            { type: 'string', name: 'bar' },
            { type: 'uint16', name: 'baz' },
          ],
        },
      ],
    },
  ])
})

test('ResolveStructs Circular Reference', () => {
  type Result = ResolveStructs<
    [{ type: 'Name'; name: 'name' }],
    {
      Person: [{ type: 'Name'; name: 'name' }]
      Name: [{ type: 'Foo'; name: 'foo' }]
      Foo: [{ type: 'Name'; name: 'foo' }, { type: 'uint16'; name: 'baz' }]
    }
  >

  assertType<Result>([
    {
      type: 'tuple',
      name: 'name',
      components: [
        {
          type: 'tuple',
          name: 'foo',
          components: [
            'Error: Circular reference on type "Name" and name "foo"',
            { type: 'uint16', name: 'baz' },
          ],
        },
      ],
    },
  ])

  type ResultUnknow = ResolveStructs<
    [{ type: 'Name'; name: 'name' }],
    {
      Person: [{ type: 'Name'; name: 'name' }]
      Name: [{ type: 'Foo'; name: 'foo' }]
      Foo: [{ type: 'Hello'; name: 'foo' }, { type: 'uint16'; name: 'baz' }]
    }
  >

  assertType<ResultUnknow>([
    {
      type: 'tuple',
      name: 'name',
      components: [
        {
          type: 'tuple',
          name: 'foo',
          components: [
            'Error: Unknow type found "Hello"', //{name: "foo", type: "Hello"},
            { type: 'uint16', name: 'baz' },
          ],
        },
      ],
    },
  ])
})
