import { expect, test } from 'vitest'

import { parseStructs } from './structs'

test('no structs', () => {
  expect(parseStructs([''])).toMatchInlineSnapshot('{}')
  expect(parseStructs(['function foo()', 'event Foo()'])).toMatchInlineSnapshot(
    '{}',
  )
})

test('no properties', () => {
  expect(() =>
    parseStructs(['struct Foo {}']),
  ).toThrowErrorMatchingInlineSnapshot(
    '"Invalid struct: no properties exist for \\"struct Foo {}\\""',
  )
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

test('parsed and resolves nested structs', () => {
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

test.todo('struct does not exist when resolving', () => {
  expect(() =>
    parseStructs(['struct Foo { Bar bar; }']),
  ).toThrowErrorMatchingInlineSnapshot()
})

test.todo('throws if recursive structs are detected', () => {
  expect(() =>
    parseStructs(['struct Foo { Bar bar; }', 'struct Bar { Foo foo; }']),
  ).toThrowErrorMatchingInlineSnapshot()
})

test.todo('throws if property is missing semicolon', () => {
  expect(() =>
    parseStructs(['struct Foo { string bar; address baz }']),
  ).toThrowErrorMatchingInlineSnapshot()
})
