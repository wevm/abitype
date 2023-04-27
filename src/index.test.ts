import { expect, it } from 'vitest'

import * as Exports from './index.js'

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "BaseError",
      "narrow",
      "parseAbi",
      "parseAbiItem",
      "parseAbiParameter",
      "parseAbiParameters",
      "CircularReferenceError",
      "InvalidParenthesisError",
      "UnknownSignatureError",
      "InvalidSignatureError",
      "InvalidStructSignatureError",
      "InvalidAbiParameterError",
      "InvalidAbiParametersError",
      "InvalidParameterError",
      "SolidityProtectedKeywordError",
      "InvalidModifierError",
      "InvalidFunctionModifierError",
      "InvalidAbiTypeParameterError",
      "InvalidAbiItemError",
      "UnknownTypeError",
    ]
  `)
})
