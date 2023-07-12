import { type TypedData, parseTypedData } from 'abitype'
import { test } from 'vitest'

import { signTypedData, signTypedDataV2 } from './signTypedData.js'

test('basic', () => {
  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  } as const

  const types = parseTypedData([
    'struct Person { Name name; address wallet; string[3] favoriteColors; uint8 age; }',
    'struct Mail { Person from; Person to; string contents;}',
    'struct Name { string first; string last;}',
  ])

  const resolvedTypes = parseTypedData(
    [
      'struct Person { Name name; address wallet; string[3] favoriteColors; uint8 age; }',
      'struct Mail { Person from; Person to; string contents;}',
      'struct Name { string first; string last;}',
    ],
    true,
  )

  signTypedData({
    domain,
    types,
    primaryType: 'Name',
    message: {
      first: 'Tom',
      last: 'Meagher',
    },
  })

  signTypedDataV2({
    domain,
    types: resolvedTypes,
    primaryType: 'Name',
    message: { first: 'John', last: 'Doe' },
  })

  signTypedData({
    domain,
    types,
    primaryType: 'Person',
    message: {
      name: {
        first: 'Tom',
        last: 'Meagher',
      },
      wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
      favoriteColors: ['gray', 'forest green', 'orange'],
      age: 29,
    },
  })

  signTypedDataV2({
    domain,
    types: resolvedTypes,
    primaryType: 'Person',
    message: {
      name: {
        first: 'John',
        last: 'Doe',
      },
      wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
      favoriteColors: ['gray', 'forest green', 'orange'],
      age: 29,
    },
  })

  signTypedData({
    domain,
    types,
    primaryType: 'Mail',
    message: {
      from: {
        name: {
          first: 'Tom',
          last: 'Meagher',
        },
        wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
        favoriteColors: ['gray', 'forest green', 'orange'],
        age: 29,
      },
      to: {
        name: {
          first: 'Foo',
          last: 'Bar',
        },
        wallet: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
        favoriteColors: ['purple', 'red', 'blue'],
        age: 69,
      },
      contents: 'Hello, Foo!',
    },
  })

  signTypedDataV2({
    domain,
    types: resolvedTypes,
    primaryType: 'Mail',
    message: {
      from: {
        name: {
          first: 'John',
          last: 'Doe',
        },
        wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
        favoriteColors: ['gray', 'forest green', 'orange'],
        age: 29,
      },
      to: {
        name: {
          first: 'Foo',
          last: 'Bar',
        },
        wallet: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
        favoriteColors: ['purple', 'red', 'blue'],
        age: 69,
      },
      contents: 'Hello, Foo!',
    },
  })

  signTypedData({
    domain,
    types,
    primaryType: 'Name',
    message: {
      first: 'Tom',
      // @ts-expect-error wrong type
      last: 123,
    },
  })

  signTypedData({
    domain,
    types,
    primaryType: 'Person',
    // @ts-expect-error missing `name` property
    message: {
      wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
      favoriteColors: ['gray', 'forest green', 'orange'],
      age: 29,
    },
  })

  signTypedDataV2({
    domain,
    types: resolvedTypes,
    primaryType: 'Name',
    message: {
      first: 'Tom',
      // @ts-expect-error wrong type
      last: 123,
    },
  })

  signTypedDataV2({
    domain,
    types: resolvedTypes,
    primaryType: 'Person',
    // @ts-expect-error missing `name` property
    message: {
      wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
      favoriteColors: ['gray', 'forest green', 'orange'],
      age: 29,
    },
  })
})

test('deeply nested structs', () => {
  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  } as const

  const types = parseTypedData([
    'struct Contributor { string name; address owner; }',
    'struct Website { string domain; Contributor webmaster; }',
    'struct Project { string name; Contributor[2] contributors; Website website; }',
    'struct Organization { string name; Project[] projects; }',
  ])

  const resolvedTypes = parseTypedData(
    [
      'struct Contributor { string name; address owner; }',
      'struct Website { string domain; Contributor webmaster; }',
      'struct Project { string name; Contributor[2] contributors; Website website; }',
      'struct Organization { string name; Project[] projects; }',
    ],
    true,
  )

  signTypedData({
    domain,
    types,
    primaryType: 'Contributor',
    message: {
      name: 'John Doe',
      owner: '0x0000000000000000000000000000000000000000',
    },
  })

  signTypedData({
    domain,
    types,
    primaryType: 'Organization',
    message: {
      name: 'My Organization',
      projects: [
        {
          name: 'My Project',
          contributors: [
            {
              name: 'John Doe',
              owner: '0x0000000000000000000000000000000000000000',
            },
            {
              name: 'John Doe',
              owner: '0x0000000000000000000000000000000000000000',
            },
          ],
          website: {
            domain: 'example.com',
            webmaster: {
              name: 'John Doe',
              owner: '0x0000000000000000000000000000000000000000',
            },
          },
        },
      ],
    },
  })

  signTypedDataV2({
    domain,
    types: resolvedTypes,
    primaryType: 'Contributor',
    message: {
      name: 'John Doe',
      owner: '0x0000000000000000000000000000000000000000',
    },
  })

  signTypedDataV2({
    domain,
    types: resolvedTypes,
    primaryType: 'Organization',
    message: {
      name: 'My Organization',
      projects: [
        {
          name: 'My Project',
          contributors: [
            {
              name: 'John Doe',
              owner: '0x0000000000000000000000000000000000000000',
            },
            {
              name: 'John Doe',
              owner: '0x0000000000000000000000000000000000000000',
            },
          ],
          website: {
            domain: 'example.com',
            webmaster: {
              name: 'John Doe',
              owner: '0x0000000000000000000000000000000000000000',
            },
          },
        },
      ],
    },
  })
})

test('behavior', () => {
  test('no const assertion', () => {
    const types = {
      Person: [
        { name: 'name', type: 'Name' },
        { name: 'wallet', type: 'address' },
        { name: 'favoriteColors', type: 'string[3]' },
        { name: 'age', type: 'uint8' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
      Name: [
        { name: 'first', type: 'string' },
        { name: 'last', type: 'string' },
      ],
    }
    signTypedData({
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      types,
      primaryType: 'Name',
      message: {
        first: 'Tom',
        last: 'Meagher',
      },
    })
  })

  test('declared as TypedData type', () => {
    const types: TypedData = {
      Person: [
        { name: 'name', type: 'Name' },
        { name: 'wallet', type: 'address' },
        { name: 'favoriteColors', type: 'string[3]' },
        { name: 'age', type: 'uint8' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
      Name: [
        { name: 'first', type: 'string' },
        { name: 'last', type: 'string' },
      ],
    }
    signTypedData({
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      types,
      primaryType: 'Name',
      message: {
        first: 'Tom',
        last: 'Meagher',
      },
    })
  })

  test('defined inline', () => {
    signTypedData({
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      types: {
        Person: [
          { name: 'name', type: 'Name' },
          { name: 'wallet', type: 'address' },
          { name: 'favoriteColors', type: 'string[3]' },
          { name: 'age', type: 'uint8' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
        Name: [
          { name: 'first', type: 'string' },
          { name: 'last', type: 'string' },
        ],
      },
      primaryType: 'Name',
      message: {
        first: 'Tom',
        last: 'Meagher',
      },
    })

    signTypedDataV2({
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      types: parseTypedData(
        [
          'struct Person { Name name; address wallet; string[3] favoriteColors; uint8 age; }',
          'struct Mail { Person from; Person to; string contents;}',
          'struct Name { string first; string last;}',
        ],
        true,
      ),
      primaryType: 'Name',
      message: {
        first: 'John',
        last: 'Doe',
      },
    })
  })
})
