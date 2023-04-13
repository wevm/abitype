import { expect, test } from 'vitest'

import {
  InvalidAbiParameterError,
  InvalidAbiParametersError,
  InvalidAbiTypeParameterError,
  InvalidFunctionModifierError,
  InvalidModifierError,
  InvalidParameterError,
  SolidityProtectedKeywordError,
} from './abiParameter'

test('InvalidAbiParamterError', () => {
  expect(new InvalidAbiParameterError({ param: 'addres owner' }))
    .toMatchInlineSnapshot(`
    [InvalidAbiParameterError: Failed to parse ABI parameter.

    Docs: https://abitype.dev/api/human.html#parseabiparameter-1
    Details: parseAbiParameter("addres owner")
    Version: abitype@x.y.z]
  `)
})

test('InvalidAbiParamtersError', () => {
  expect(new InvalidAbiParametersError({ params: 'addres owner' }))
    .toMatchInlineSnapshot(`
    [InvalidAbiParametersError: Failed to parse ABI parameters.

    Docs: https://abitype.dev/api/human.html#parseabiparameters-1
    Details: parseAbiParameters("addres owner")
    Version: abitype@x.y.z]
  `)
})

test('InvalidParameterError', () => {
  expect(
    new InvalidParameterError({
      param: 'addres',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidParameterError: Invalid ABI parameter.

    Details: addres
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
      abiParameter: { type: 'addres' },
    }),
  ).toMatchInlineSnapshot(`
    [InvalidAbiTypeParameterError: Invalid ABI parameter.
    
    ABI parameter type is invalid.

    Details: {
      "type": "addres"
    }
    Version: abitype@x.y.z]
  `)
})
