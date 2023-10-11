import { expect, it } from 'vitest'

import * as Exports from './index.js'

it('exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "BaseError",
      "narrow",
      "formatAbi",
      "formatAbiItem",
      "formatAbiParameter",
      "formatAbiParameters",
      "parseAbi",
      "parseAbiItem",
      "parseAbiParameter",
      "parseAbiParameters",
      "UnknownTypeError",
      "InvalidAbiItemError",
      "UnknownSolidityTypeError",
      "InvalidAbiTypeParameterError",
      "InvalidFunctionModifierError",
      "InvalidModifierError",
      "SolidityProtectedKeywordError",
      "InvalidParameterError",
      "InvalidAbiParametersError",
      "InvalidAbiParameterError",
      "InvalidStructSignatureError",
      "InvalidSignatureError",
      "UnknownSignatureError",
      "InvalidParenthesisError",
      "CircularReferenceError",
    ]
  `)
})
