import { expect, test } from 'vitest'

import {
  InvalidAbiParameterError,
  InvalidAbiParametersError,
  InvalidAbiTypeParameterError,
  InvalidFunctionModifierError,
  InvalidModifierError,
  InvalidParameterError,
  SolidityProtectedKeywordError,
} from './abiParameter.js'

test('InvalidAbiParamterError', () => {
  expect(
    new InvalidAbiParameterError({ param: 'address owner' }),
  ).toMatchInlineSnapshot(`
    [InvalidAbiParameterError: Failed to parse ABI parameter.

    Docs: https://abitype.dev/api/human#parseabiparameter-1
    Details: parseAbiParameter("address owner")
    Version: abitype@x.y.z]
  `)
})

test('InvalidAbiParamtersError', () => {
  expect(
    new InvalidAbiParametersError({ params: 'address owner' }),
  ).toMatchInlineSnapshot(`
    [InvalidAbiParametersError: Failed to parse ABI parameters.

    Docs: https://abitype.dev/api/human#parseabiparameters-1
    Details: parseAbiParameters("address owner")
    Version: abitype@x.y.z]
  `)
})

test('InvalidParameterError', () => {
  expect(
    new InvalidParameterError({
      param: 'address',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidParameterError: Invalid ABI parameter.

    Details: address
    Version: abitype@x.y.z]
  `)
})

test('SolidityProtectedKeywordError', () => {
  expect(
    new SolidityProtectedKeywordError({
      param: 'address',
      name: 'address',
    }),
  ).toMatchInlineSnapshot(`
    [SolidityProtectedKeywordError: Invalid ABI parameter.
    
    "address" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html

    Details: address
    Version: abitype@x.y.z]
  `)
})

test('InvalidModifierError', () => {
  expect(
    new InvalidModifierError({
      param: 'address',
      modifier: 'calldata',
      type: 'event',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidModifierError: Invalid ABI parameter.
    
    Modifier "calldata" not allowed in "event" type.

    Details: address
    Version: abitype@x.y.z]
  `)

  expect(
    new InvalidModifierError({
      param: 'address',
      modifier: 'calldata',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidModifierError: Invalid ABI parameter.
    
    Modifier "calldata" not allowed.

    Details: address
    Version: abitype@x.y.z]
  `)
})

test('InvalidFunctionModifierError', () => {
  expect(
    new InvalidFunctionModifierError({
      param: 'address',
      modifier: 'calldata',
      type: 'function',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidFunctionModifierError: Invalid ABI parameter.
    
    Modifier "calldata" not allowed in "function" type.
    Data location can only be specified for array, struct, or mapping types, but "calldata" was given.

    Details: address
    Version: abitype@x.y.z]
  `)
})

test('InvalidAbiTypeParameterError', () => {
  expect(
    new InvalidAbiTypeParameterError({
      abiParameter: { type: 'address' },
    }),
  ).toMatchInlineSnapshot(`
    [InvalidAbiTypeParameterError: Invalid ABI parameter.
    
    ABI parameter type is invalid.

    Details: {
      "type": "address"
    }
    Version: abitype@x.y.z]
  `)
})
