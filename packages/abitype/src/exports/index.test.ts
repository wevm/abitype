import { expect, expectTypeOf, it } from 'vitest'

import * as Exports from './index.js'
import type * as a from './index.js'
import type {
  a as namedA,
  abi as namedAbi,
  typedData as namedTypedData,
} from './index.js'

const abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'InsufficientBalance',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'balance', type: 'uint256' },
      { name: 'required', type: 'uint256' },
    ],
  },
] as const satisfies a.abi

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

it('exports lowercamel namespace types', () => {
  type Abi = typeof abi

  expectTypeOf<a.abi>().toMatchTypeOf<readonly unknown[]>()
  expectTypeOf<namedA.abi>().toEqualTypeOf<a.abi>()
  expectTypeOf<namedAbi>().toEqualTypeOf<a.abi>()
  expectTypeOf<a.abi.valid<Abi>>().toEqualTypeOf<true>()

  expectTypeOf<a.abi.types.string>().toEqualTypeOf<'string'>()
  expectTypeOf<a.abi.types.function>().toEqualTypeOf<'function'>()
  expectTypeOf<a.abi.types.infer<'uint256'>>().toEqualTypeOf<bigint>()

  expectTypeOf<
    a.abi.parameter.infer<{ name: 'amount'; type: 'uint256' }>
  >().toEqualTypeOf<bigint>()
  expectTypeOf<
    a.abi.parameters.infer<
      readonly [
        { name: 'owner'; type: 'address' },
        { name: 'amount'; type: 'uint256' },
      ],
      'inputs'
    >
  >().toEqualTypeOf<readonly [`0x${string}`, bigint]>()

  expectTypeOf<
    a.abi.functions.items<Abi>
  >().toMatchTypeOf<a.abi.functions.item>()
  expectTypeOf<a.abi.functions.names<Abi>>().toEqualTypeOf<'balanceOf'>()
  expectTypeOf<namedA.abi.functions.names<Abi>>().toEqualTypeOf<'balanceOf'>()
  expectTypeOf<namedAbi.functions.names<Abi>>().toEqualTypeOf<'balanceOf'>()
  expectTypeOf<
    a.abi.functions.extract<Abi, 'balanceOf'>['name']
  >().toEqualTypeOf<'balanceOf'>()

  expectTypeOf<a.abi.events.names<Abi>>().toEqualTypeOf<'Transfer'>()
  expectTypeOf<
    a.abi.events.extract<Abi, 'Transfer'>['name']
  >().toEqualTypeOf<'Transfer'>()

  expectTypeOf<a.abi.errors.names<Abi>>().toEqualTypeOf<'InsufficientBalance'>()
  expectTypeOf<
    a.abi.errors.extract<Abi, 'InsufficientBalance'>['name']
  >().toEqualTypeOf<'InsufficientBalance'>()

  expectTypeOf<a.abi.constructors.item['type']>().toEqualTypeOf<'constructor'>()
  expectTypeOf<a.abi.fallback.item['type']>().toEqualTypeOf<'fallback'>()
  expectTypeOf<a.abi.receive.item['type']>().toEqualTypeOf<'receive'>()

  type TypedData = {
    Person: readonly [
      { name: 'name'; type: 'string' },
      { name: 'wallet'; type: 'address' },
    ]
  }
  expectTypeOf<a.typedData.valid<TypedData>>().toEqualTypeOf<true>()
  expectTypeOf<a.typedData.infer<TypedData>['Person']>().toEqualTypeOf<{
    name: string
    wallet: `0x${string}`
  }>()
  expectTypeOf<namedA.typedData.infer<TypedData>>().toEqualTypeOf<
    a.typedData.infer<TypedData>
  >()
  expectTypeOf<namedTypedData.infer<TypedData>>().toEqualTypeOf<
    a.typedData.infer<TypedData>
  >()
})
