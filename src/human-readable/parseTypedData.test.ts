import { expect, test } from 'vitest'

import { parseTypedData } from './parseTypedData.js'

test('parses nested structs', () => {
  const typedData = parseTypedData([
    'struct Fulfillment { FulfillmentComponent[2] offerComponents; FulfillmentComponent[] considerationComponents; }',
    'struct FulfillmentComponent { uint256 orderIndex; uint256 itemIndex; }',
    'struct Foo { Fulfillment fulfillment; }',
  ])

  expect(typedData).toMatchInlineSnapshot(`
    {
      "Foo": [
        {
          "name": "fulfillment",
          "type": "Fulfillment",
        },
      ],
      "Fulfillment": [
        {
          "name": "offerComponents",
          "type": "FulfillmentComponent[2]",
        },
        {
          "name": "considerationComponents",
          "type": "FulfillmentComponent[]",
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

test('parses and resolves nested structs', () => {
  const typedData = parseTypedData(
    [
      'struct Fulfillment { FulfillmentComponent[2] offerComponents; FulfillmentComponent[] considerationComponents; }',
      'struct FulfillmentComponent { uint256 orderIndex; uint256 itemIndex; }',
      'struct Foo { Fulfillment fulfillment; }',
    ],
    true,
  )

  expect(typedData).toMatchInlineSnapshot(`
    {
      "Foo": {
        "fulfillment": {
          "considerationComponents": [
            {
              "itemIndex": "uint256",
              "orderIndex": "uint256",
            },
          ],
          "offerComponents": [
            {
              "itemIndex": "uint256",
              "orderIndex": "uint256",
            },
            {
              "itemIndex": "uint256",
              "orderIndex": "uint256",
            },
          ],
        },
      },
      "Fulfillment": {
        "considerationComponents": [
          {
            "itemIndex": "uint256",
            "orderIndex": "uint256",
          },
        ],
        "offerComponents": [
          {
            "itemIndex": "uint256",
            "orderIndex": "uint256",
          },
          {
            "itemIndex": "uint256",
            "orderIndex": "uint256",
          },
        ],
      },
      "FulfillmentComponent": {
        "itemIndex": "uint256",
        "orderIndex": "uint256",
      },
    }
  `)

  expect(
    parseTypedData(
      [
        'struct FulfillmentComponent { uint256[5] orderIndex; uint256 itemIndex; }',
      ],
      true,
    ),
  ).toMatchInlineSnapshot(`
    {
      "FulfillmentComponent": {
        "itemIndex": "uint256",
        "orderIndex": [
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
        ],
      },
    }
  `)
})

test('Circular reference', () => {
  expect(() =>
    parseTypedData(['struct Name { address foo; Name name;}'], true),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Circular reference detected.

    Struct \\"Name\\" is a circular reference.

    Version: abitype@x.y.z"
  `)
})

test('Unknown type', () => {
  expect(() =>
    parseTypedData(['struct Name { address foo; Foo name;}'], true),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Unknown type.

    Type \\"Foo\\" is not a valid ABI type. Perhaps you forgot to include a struct signature?

    Version: abitype@x.y.z"
  `)
})

test('Invalid signatures', () => {
  expect(() =>
    // @ts-expect-error invalid signature type
    parseTypedData([]),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Invalid struct signature.

    No properties exist.

    Version: abitype@x.y.z"
  `)

  expect(() =>
    // @ts-expect-error invalid signature type
    parseTypedData(['function foo()', 'error Bar()']),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Invalid struct signature.

    Details: function foo()
    Version: abitype@x.y.z"
  `)
})

test('Invalid parameter', () => {
  expect(() =>
    parseTypedData(['struct Name { address? foo; }'], true),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Invalid ABI parameter.

    Details: address? foo
    Version: abitype@x.y.z"
  `)

  expect(() =>
    parseTypedData(['struct Name { address? foo; }']),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Invalid ABI parameter.

    Details: address? foo
    Version: abitype@x.y.z"
  `)
})

test('Missing named parameter', () => {
  expect(() =>
    parseTypedData(['struct Name { address;}'], true),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Missing named parameter for EIP-712 typed data.

    named parameter for type address must be present.

    Version: abitype@x.y.z"
  `)
})

test('parses with circular reference', () => {
  expect(
    parseTypedData(['struct Name { address foo; Name name;}']),
  ).toMatchInlineSnapshot(`
    {
      "Name": [
        {
          "name": "foo",
          "type": "address",
        },
        {
          "name": "name",
          "type": "Name",
        },
      ],
    }
  `)
})

test('parses with unknown type', () => {
  expect(
    parseTypedData(['struct Name { address foo; Foo name;}']),
  ).toMatchInlineSnapshot(`
    {
      "Name": [
        {
          "name": "foo",
          "type": "address",
        },
        {
          "name": "name",
          "type": "Foo",
        },
      ],
    }
  `)
})
