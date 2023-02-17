import { assertType, test } from 'vitest'

import type {
  ParseStruct,
  ParseStructProperties,
  ParseStructs,
  ResolveStructs,
} from './structs'

test('ParseStructProperties', () => {
  assertType<ParseStructProperties<'string foo; string bar;'>>([
    { type: 'string', name: 'foo' },
    { type: 'string', name: 'bar' },
  ])
})

test('ParseStruct', () => {
  assertType<ParseStruct<'struct Foo { string foo; string bar; }'>>({
    name: 'Foo',
    components: [
      { type: 'string', name: 'foo' },
      { type: 'string', name: 'bar' },
    ],
  })
})

test('ParseStructs', () => {
  type Result = ParseStructs<
    [
      'struct Person { Name name; }',
      'struct Name { Foo foo; }',
      'struct Foo { string bar; }',
      'function addPerson(Person person)',
    ]
  >
  assertType<Result>({
    Name: [
      {
        type: 'tuple',
        name: 'foo',
        components: [{ type: 'string', name: 'bar' }],
      },
    ],
    Foo: [{ type: 'string', name: 'bar' }],
    Person: [
      {
        type: 'tuple',
        name: 'name',
        components: [
          {
            type: 'tuple',
            name: 'foo',
            components: [{ type: 'string', name: 'bar' }],
          },
        ],
      },
    ],
  })

  assertType<ParseStructs<['struct Person { Name name;']>>({})
  assertType<ParseStructs<[]>>({})
  assertType<ParseStructs<['function addPerson(Person person)']>>({})
})

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
