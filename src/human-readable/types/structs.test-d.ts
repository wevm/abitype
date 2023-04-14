import { expectTypeOf, test } from 'vitest'

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
  expectTypeOf<Result>().toEqualTypeOf<{
    Name: readonly [
      {
        readonly type: 'tuple'
        readonly name: 'foo'
        readonly components: readonly [{ type: 'string'; name: 'bar' }]
      },
    ]
    Foo: readonly [{ readonly type: 'string'; readonly name: 'bar' }]
    Person: readonly [
      {
        readonly type: 'tuple'
        readonly name: 'name'
        readonly components: readonly [
          {
            readonly type: 'tuple'
            readonly name: 'foo'
            readonly components: [
              { readonly type: 'string'; readonly name: 'bar' },
            ]
          },
        ]
      },
    ]
  }>()

  expectTypeOf<
    ParseStructs<['struct Foo { Bar bar; }', 'struct Bar { Foo foo; }']>
  >().toEqualTypeOf<{
    Foo: readonly [
      {
        readonly name: 'bar'
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly name: 'foo'
            readonly type: 'tuple'
            readonly components: readonly [
              [
                'Error: Circular reference detected. Struct "Bar" is a circular reference.',
              ],
            ]
          },
        ]
      },
    ]
    Bar: readonly [
      {
        readonly name: 'foo'
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly name: 'bar'
            readonly type: 'tuple'
            readonly components: readonly [
              [
                'Error: Circular reference detected. Struct "Foo" is a circular reference.',
              ],
            ]
          },
        ]
      },
    ]
  }>()

  expectTypeOf<ParseStructs<['struct Foo { Foo foo; }']>>().toEqualTypeOf<{
    Foo: readonly [
      {
        readonly name: 'foo'
        readonly type: 'tuple'
        readonly components: readonly [
          [
            'Error: Circular reference detected. Struct "Foo" is a circular reference.',
          ],
        ]
      },
    ]
  }>()

  expectTypeOf<
    ParseStructs<['struct Person { Name name;']>
  >().toEqualTypeOf<{}>()

  expectTypeOf<ParseStructs<[]>>().toEqualTypeOf<{}>()
  expectTypeOf<
    ParseStructs<['function addPerson(Person person)']>
  >().toEqualTypeOf<{}>()
})

test('ParseStruct', () => {
  expectTypeOf<
    ParseStruct<'struct Foo { string foo; string bar; }'>
  >().toEqualTypeOf<{
    readonly name: 'Foo'
    readonly components: [
      { type: 'string'; name: 'foo' },
      { type: 'string'; name: 'bar' },
    ]
  }>()
  expectTypeOf<ParseStruct<'struct Foo {}'>>().toEqualTypeOf<{
    readonly name: 'Foo'
    readonly components: []
  }>()
  expectTypeOf<ParseStruct<'struct Foo { Bar bar; }'>>().toEqualTypeOf<{
    readonly name: 'Foo'
    readonly components: [
      {
        type: 'Bar'
        name: 'bar'
      },
    ]
  }>()

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
  expectTypeOf<Result>().toEqualTypeOf<
    readonly [
      {
        readonly type: 'tuple'
        readonly name: 'name'
        readonly components: readonly [
          {
            readonly type: 'tuple'
            readonly name: 'foo'
            readonly components: readonly [
              { readonly type: 'string'; readonly name: 'bar' },
              { readonly type: 'uint16'; readonly name: 'baz' },
            ]
          },
        ]
      },
    ]
  >()

  expectTypeOf<ResolveStructs<[], StructLookup>>().toEqualTypeOf<readonly []>()
  expectTypeOf<
    ResolveStructs<
      [{ type: 'Foo[]'; name: 'foo' }],
      { Foo: [{ type: 'string'; name: 'bar' }] }
    >
  >().toEqualTypeOf<
    readonly [
      {
        readonly name: 'foo'
        readonly type: 'tuple[]'
        readonly components: readonly [
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
  expectTypeOf<ParseStructProperties<'string;'>>().toEqualTypeOf<
    [{ type: 'string' }]
  >()
  expectTypeOf<ParseStructProperties<'string foo;'>>().toEqualTypeOf<
    [{ type: 'string'; name: 'foo' }]
  >()
  expectTypeOf<ParseStructProperties<'string; string;'>>().toEqualTypeOf<
    [{ type: 'string' }, { type: 'string' }]
  >()
  expectTypeOf<
    ParseStructProperties<'string foo; string bar;'>
  >().toEqualTypeOf<
    [{ type: 'string'; name: 'foo' }, { type: 'string'; name: 'bar' }]
  >()

  expectTypeOf<ParseStructProperties<''>>().toEqualTypeOf<[]>()
  expectTypeOf<ParseStructProperties<'string'>>().toEqualTypeOf<[]>()
  expectTypeOf<ParseStructProperties<'string; string'>>().toEqualTypeOf<
    [{ type: 'string' }]
  >()
})
