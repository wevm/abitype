import type { TypedData } from '../abi.js'
import { type ParseTypedData, parseTypedData } from './parseTypedData.js'
import { expectTypeOf, test } from 'vitest'

test('ParseTypedData', () => {
  type Result = ParseTypedData<
    [
      'struct Person { Name name; }',
      'struct Name { Foo foo; }',
      'struct Foo { string bar; }',
      'function addPerson(Person person)',
    ]
  >
  expectTypeOf<Result>().toEqualTypeOf<never>()

  expectTypeOf<ParseTypedData<string[]>>().toEqualTypeOf<TypedData>()
  expectTypeOf<
    ParseTypedData<['function foo(address bar)']>
  >().toEqualTypeOf<never>()

  expectTypeOf<
    ParseTypedData<
      [
        'struct Person { Name name; }',
        'struct Name { Foo foo; }',
        'struct Foo { string bar; }',
      ]
    >
  >().toEqualTypeOf<{
    Person: [{ type: 'Name'; name: 'name' }]
    Name: [{ type: 'Foo'; name: 'foo' }]
    Foo: [{ type: 'string'; name: 'bar' }]
  }>()

  expectTypeOf<
    ParseTypedData<
      [
        'struct Person { Name name; }',
        'struct Name { Foo foo; }',
        'struct Foo { string bar; }',
      ],
      true
    >
  >().toEqualTypeOf<{
    Person: { name: { foo: { bar: 'string' } } }
    Name: { foo: { bar: 'string' } }
    Foo: { bar: 'string' }
  }>()
})

test('parseTypedData', () => {
  const typedData = parseTypedData([
    'struct Person { Name name; }',
    'struct Name { Foo foo; }',
    'struct Foo { string bar; }',
  ])

  expectTypeOf<typeof typedData>().toEqualTypeOf<{
    Person: [{ type: 'Name'; name: 'name' }]
    Name: [{ type: 'Foo'; name: 'foo' }]
    Foo: [{ type: 'string'; name: 'bar' }]
  }>()

  const resolvedtypedData = parseTypedData(
    [
      'struct Person { Name name; }',
      'struct Name { Foo foo; }',
      'struct Foo { string bar; }',
    ],
    true,
  )

  expectTypeOf<typeof resolvedtypedData>().toEqualTypeOf<{
    Person: { name: { foo: { bar: 'string' } } }
    Name: { foo: { bar: 'string' } }
    Foo: { bar: 'string' }
  }>()

  // @ts-expect-error empty array not allowed
  expectTypeOf(parseTypedData([])).toEqualTypeOf<never>()

  expectTypeOf(
    // @ts-expect-error invalid signature
    parseTypedData(['function foo(address bar)']),
  ).toEqualTypeOf<never>()

  const struct = ['struct Foo { string bar; }']

  expectTypeOf(parseTypedData(struct)).toEqualTypeOf<TypedData>()
})
