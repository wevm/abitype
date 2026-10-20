import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import abi from './token.abi'

// The JSON import itself is narrow: no assertion or narrowing helper is needed.
abi satisfies Abi

type Equal<a, b> =
  (<t>() => t extends a ? 1 : 2) extends <t>() => t extends b ? 1 : 2
    ? true
    : false
type Expect<value extends true> = value

export type Assertions = [
  Expect<
    Equal<
      ExtractAbiFunctionNames<typeof abi>,
      'balanceOf' | 'transfer' | 'quote'
    >
  >,
  Expect<
    Equal<ExtractAbiFunctionNames<typeof abi, 'view'>, 'balanceOf' | 'quote'>
  >,
  Expect<Equal<ExtractAbiFunctionNames<typeof abi, 'nonpayable'>, 'transfer'>>,
  Expect<Equal<(typeof abi)['length'], 3>>,
  Expect<
    Equal<
      AbiParametersToPrimitiveTypes<
        ExtractAbiFunction<typeof abi, 'transfer'>['inputs']
      >,
      readonly [`0x${string}`, bigint]
    >
  >,
  Expect<
    Equal<
      AbiParametersToPrimitiveTypes<
        ExtractAbiFunction<typeof abi, 'transfer'>['outputs']
      >,
      readonly [boolean]
    >
  >,
  Expect<
    Equal<
      AbiParametersToPrimitiveTypes<
        ExtractAbiFunction<typeof abi, 'quote'>['inputs']
      >,
      readonly [
        { recipient: `0x${string}`; amounts: readonly [bigint, bigint] },
      ]
    >
  >,
  Expect<Equal<(typeof abi)[2]['outputs'][0]['name'], 'label 🪙'>>,
]
