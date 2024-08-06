import { expect, test } from 'vitest'

import { parseStructs } from './structs.js'

test('no structs', () => {
  expect(parseStructs([])).toMatchInlineSnapshot('{}')
  expect(parseStructs([''])).toMatchInlineSnapshot('{}')
  expect(parseStructs(['function foo()', 'event Foo()'])).toMatchInlineSnapshot(
    '{}',
  )
  expect(
    parseStructs(['function addPerson(Person person)']),
  ).toMatchInlineSnapshot('{}')
})

test('parses basic structs', () => {
  expect(
    parseStructs([
      'struct Foo { string bar; address baz; }',
      'struct FulfillmentComponent { uint256 orderIndex; uint256 itemIndex; }',
    ]),
  ).toMatchInlineSnapshot(`
    {
      "Foo": [
        {
          "name": "bar",
          "type": "string",
        },
        {
          "name": "baz",
          "type": "address",
        },
      ],
      "FulfillmentComponent": [
        {
          "name": "orderIndex",
          "type": "uint256",
        },
        {
          "name": "itemIndex",
          "type": "uint256",
        },
      ],
    }
  `)
})

test('parses valid names', () => {
  expect(
    parseStructs([
      'struct $ { string; }',
      'struct $_a9 { string; }',
      'struct _ { string; }',
      'struct abc$_9 { string; }',
    ]),
  ).toMatchInlineSnapshot(`
    {
      "$": [
        {
          "type": "string",
        },
      ],
      "$_a9": [
        {
          "type": "string",
        },
      ],
      "_": [
        {
          "type": "string",
        },
      ],
      "abc$_9": [
        {
          "type": "string",
        },
      ],
    }
  `)
})

test('parses and resolves nested structs', () => {
  expect(
    parseStructs([
      'struct Fulfillment { FulfillmentComponent[] offerComponents; FulfillmentComponent[] considerationComponents; }',
      'struct FulfillmentComponent { uint256 orderIndex; uint256 itemIndex; }',
      'struct Foo { Fulfillment fulfillment; }',
    ]),
  ).toMatchInlineSnapshot(`
    {
      "Foo": [
        {
          "components": [
            {
              "components": [
                {
                  "name": "orderIndex",
                  "type": "uint256",
                },
                {
                  "name": "itemIndex",
                  "type": "uint256",
                },
              ],
              "name": "offerComponents",
              "type": "tuple[]",
            },
            {
              "components": [
                {
                  "name": "orderIndex",
                  "type": "uint256",
                },
                {
                  "name": "itemIndex",
                  "type": "uint256",
                },
              ],
              "name": "considerationComponents",
              "type": "tuple[]",
            },
          ],
          "name": "fulfillment",
          "type": "tuple",
        },
      ],
      "Fulfillment": [
        {
          "components": [
            {
              "name": "orderIndex",
              "type": "uint256",
            },
            {
              "name": "itemIndex",
              "type": "uint256",
            },
          ],
          "name": "offerComponents",
          "type": "tuple[]",
        },
        {
          "components": [
            {
              "name": "orderIndex",
              "type": "uint256",
            },
            {
              "name": "itemIndex",
              "type": "uint256",
            },
          ],
          "name": "considerationComponents",
          "type": "tuple[]",
        },
      ],
      "FulfillmentComponent": [
        {
          "name": "orderIndex",
          "type": "uint256",
        },
        {
          "name": "itemIndex",
          "type": "uint256",
        },
      ],
    }
  `)
})

test('no properties', () => {
  expect(() =>
    parseStructs(['struct Foo {}']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidStructSignatureError: Invalid struct signature.

    No properties exist.

    Details: struct Foo {}
    Version: abitype@x.y.z]
  `,
  )
})

test('struct does not exist when resolving', () => {
  expect(() =>
    parseStructs(['struct Foo { Bar bar; }']),
  ).toThrowErrorMatchingInlineSnapshot(`
    [UnknownTypeError: Unknown type.

    Type "Bar" is not a valid ABI type. Perhaps you forgot to include a struct signature?

    Version: abitype@x.y.z]
  `)
})

test('throws if recursive structs are detected', () => {
  expect(() =>
    parseStructs(['struct Foo { Bar bar; }', 'struct Bar { Foo foo; }']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [CircularReferenceError: Circular reference detected.

    Struct "Bar" is a circular reference.

    Version: abitype@x.y.z]
  `,
  )
})

test.todo('throws if property is missing semicolon', () => {
  expect(() =>
    parseStructs(['struct Foo { string bar; address baz }']),
  ).toThrowErrorMatchingInlineSnapshot()
})
