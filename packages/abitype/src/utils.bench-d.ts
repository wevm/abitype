import { bench } from '@arktype/attest'

import type {
  AbiParameterToPrimitiveType,
  AbiTypeToPrimitiveType,
  TypedDataToPrimitiveTypes,
} from './utils.js'

bench('AbiTypeToPrimitiveType > string', () => {
  type Result = AbiTypeToPrimitiveType<'string'>
  return {} as Result
}).types([19, 'instantiations'])

bench('AbiTypeToPrimitiveType > bytes32', () => {
  type Result = AbiTypeToPrimitiveType<'bytes32'>
  return {} as Result
}).types([23, 'instantiations'])

//////////////////////////////////////////////////////////////////////////////////

bench('AbiParameterToPrimitiveType > string', () => {
  type Result = AbiParameterToPrimitiveType<{
    name: 'foo'
    type: 'string'
  }>
  return {} as Result
}).types([575, 'instantiations'])

bench('AbiParameterToPrimitiveType > nested tuple', () => {
  type Result = AbiParameterToPrimitiveType<{
    name: 's'
    type: 'tuple'
    components: [
      { name: 'a'; type: 'uint8' },
      { name: 'b'; type: 'uint8[2]' },
      {
        name: 'c'
        type: 'tuple[]'
        components: [
          { name: 'x'; type: 'uint256' },
          {
            name: 'y'
            type: 'tuple'
            components: [{ name: 'a'; type: 'string' }]
          },
        ]
      },
    ]
  }>
  return {} as Result
}).types([655, 'instantiations'])

bench('AbiParameterToPrimitiveType > array', () => {
  type Result = AbiParameterToPrimitiveType<{
    name: 'foo'
    type: 'string[1][2][3]'
  }>
  return {} as Result
}).types([10215, 'instantiations'])

//////////////////////////////////////////////////////////////////////////////////

bench('TypedDataToPrimitiveTypes > recursive', () => {
  type Result = TypedDataToPrimitiveTypes<{
    Foo: [{ name: 'bar'; type: 'Bar[]' }]
    Bar: [{ name: 'foo'; type: 'Foo[]' }]
  }>
  return {} as Result
}).types([12105, 'instantiations'])

bench('TypedDataToPrimitiveTypes > deep', () => {
  type Result = TypedDataToPrimitiveTypes<{
    Contributor: [
      { name: 'name'; type: 'string' },
      { name: 'address'; type: 'address' },
    ]
    Website: [
      { name: 'domain'; type: 'string' },
      { name: 'webmaster'; type: 'Contributor' },
    ]
    Project: [
      { name: 'name'; type: 'string' },
      { name: 'contributors'; type: 'Contributor[2]' },
      { name: 'website'; type: 'Website' },
    ]
    Organization: [
      { name: 'name'; type: 'string' },
      { name: 'projects'; type: 'Project[]' },
      { name: 'website'; type: 'Website' },
    ]
  }>
  return {} as Result
}).types([12121, 'instantiations'])
