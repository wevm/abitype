import type { TypedData } from 'abitype'
import { test } from 'vitest'

import { signTypedData } from './signTypedData.js'

test('basic', () => {
  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  } as const
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
  } as const

  signTypedData({
    domain,
    types,
    primaryType: 'Name',
    message: {
      first: 'Tom',
      last: 'Meagher',
    },
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
})

test('deeply nested structs', () => {
  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  } as const
  const types = {
    Contributor: [
      { name: 'name', type: 'string' },
      { name: 'address', type: 'address' },
    ],
    Website: [
      { name: 'domain', type: 'string' },
      { name: 'webmaster', type: 'Contributor' },
    ],
    Project: [
      { name: 'name', type: 'string' },
      { name: 'contributors', type: 'Contributor[2]' },
      { name: 'website', type: 'Website' },
    ],
    Organization: [
      { name: 'name', type: 'string' },
      { name: 'projects', type: 'Project[]' },
    ],
  } as const

  signTypedData({
    domain,
    types,
    primaryType: 'Contributor',
    message: {
      name: 'John Doe',
      address: '0x0000000000000000000000000000000000000000',
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
              address: '0x0000000000000000000000000000000000000000',
            },
            {
              name: 'John Doe',
              address: '0x0000000000000000000000000000000000000000',
            },
          ],
          website: {
            domain: 'example.com',
            webmaster: {
              name: 'John Doe',
              address: '0x0000000000000000000000000000000000000000',
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
  })
})
