import { expect, it } from 'vitest'

import * as Exports from './index.js'

it('should expose correct exports', () => {
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
      "InvalidAbiItemError",
      "UnknownSolidityTypeError",
      "UnknownTypeError",
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
      "InvalidBytecodeError",
      "parseBytecode",
      "resolvedSelectors",
      "resolvedFunctions",
      "resolvedErrors",
      "resolvedEvents",
    ]
  `)
})
