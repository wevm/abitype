import { assertType, expectTypeOf, test } from 'vitest'

import type {
  ParseStruct,
  ParseStructProperties,
  ParseStructs,
  ResolveStructs,
  StructLookup,
} from './structs'

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

test('ParseStruct', () => {
  assertType<ParseStruct<'struct Foo { string foo; string bar; }'>>({
    name: 'Foo',
    components: [
      { type: 'string', name: 'foo' },
      { type: 'string', name: 'bar' },
    ],
  })

  expectTypeOf<ParseStruct<''>>().toEqualTypeOf<never>()
  expectTypeOf<ParseStruct<'function foo()'>>().toEqualTypeOf<never>()
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

  expectTypeOf<ResolveStructs<[], StructLookup>>().toEqualTypeOf<[]>()
  expectTypeOf<
    ResolveStructs<
      [{ type: 'Foo[]'; name: 'foo' }],
      { Foo: [{ type: 'string'; name: 'bar' }] }
    >
  >().toEqualTypeOf<
    [
      {
        name: 'foo'
        type: 'tuple[]'
        components: [
          {
            type: 'string'
            name: 'bar'
          },
        ]
      },
    ]
  >()
})

test('ParseStructProperties', () => {
  assertType<ParseStructProperties<'string;'>>([{ type: 'string' }])
  assertType<ParseStructProperties<'string foo;'>>([
    { type: 'string', name: 'foo' },
  ])
  assertType<ParseStructProperties<'string; string;'>>([
    { type: 'string' },
    { type: 'string' },
  ])
  assertType<ParseStructProperties<'string foo; string bar;'>>([
    { type: 'string', name: 'foo' },
    { type: 'string', name: 'bar' },
  ])

  assertType<ParseStructProperties<''>>([])
  assertType<ParseStructProperties<'string'>>([])
  assertType<ParseStructProperties<'string; string'>>([{ type: 'string' }])
})
