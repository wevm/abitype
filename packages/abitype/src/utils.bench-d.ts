import { bench } from '@arktype/attest'
import type {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  TypedDataToPrimitiveTypes,
} from './utils.js'

bench('AbiParameterToPrimitiveType > nested', () => {
  const abiParameter = {
    name: 's',
    type: 'tuple',
    components: [
      { name: 'a', type: 'uint8' },
      { name: 'b', type: 'uint8[2]' },
      {
        name: 'c',
        type: 'tuple[]',
        components: [
          { name: 'x', type: 'uint256' },
          {
            name: 'y',
            type: 'tuple',
            components: [{ name: 'a', type: 'string' }],
          },
        ],
      },
    ],
  } as const
  return {} as AbiParameterToPrimitiveType<typeof abiParameter>
}).types([28, 'instantiations'])

bench('AbiParametersToPrimitiveTypes > nested', () => {
  const abiParameters = [
    {
      name: 's',
      type: 'tuple',
      components: [
        { name: 'a', type: 'uint8' },
        { name: 'b', type: 'uint8[]' },
        {
          name: 'c',
          type: 'tuple[]',
          components: [
            { name: 'x', type: 'uint8' },
            { name: 'y', type: 'uint8' },
          ],
        },
      ],
    },
    {
      name: 't',
      type: 'tuple',
      components: [
        { name: 'x', type: 'uint8' },
        { name: 'y', type: 'uint8' },
      ],
    },
    { name: 'a', type: 'uint8' },
    {
      name: 't',
      type: 'tuple[2]',
      components: [
        { name: 'x', type: 'uint256' },
        { name: 'y', type: 'uint256' },
      ],
    },
  ] as const
  return {} as AbiParametersToPrimitiveTypes<typeof abiParameters>
}).types([56, 'instantiations'])

bench('TypedDataToPrimitiveTypes > recursive', () => {
  const types = {
    Foo: [{ name: 'bar', type: 'Bar[]' }],
    Bar: [{ name: 'foo', type: 'Foo[]' }],
  } as const
  return {} as TypedDataToPrimitiveTypes<typeof types>
}).types([12, 'instantiations'])

bench('TypedDataToPrimitiveTypes > deep', () => {
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
      { name: 'website', type: 'Website' },
    ],
  } as const
  return {} as TypedDataToPrimitiveTypes<typeof types>
}).types([44, 'instantiations'])
