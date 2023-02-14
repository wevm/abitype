import type { AbiParameter, AbiType } from '../abi'
import type { AssertNoWhiteSpace, Filter, Split, Trim } from '../types'
import type { ParseFunction } from './functions'
import type { IsFunctionSignature, Signature } from './signatures'
import type { ParseStructs, StructMap } from './structs'

export type ParseAbiParameter<
  T extends string,
  TStructs extends Record<string, readonly AbiParameter[]> | unknown = unknown,
  Options extends { throwUnknownType: boolean } = { throwUnknownType: true },
> = (
  T extends `${infer Type} indexed${infer Name}`
    ? {
        name: AssertNoWhiteSpace<Name>
        type: Type
        indexed: true
      }
    : T extends `${infer Type} ${infer Name}`
    ? { name: AssertNoWhiteSpace<Name>; type: Type }
    : { name: ''; type: T }
) extends infer Parameter extends AbiParameter
  ? Parameter['type'] extends AbiType
    ? Parameter
    : Parameter['type'] extends `${infer Head extends string &
        keyof TStructs}[${infer Tail}]`
    ? {
        name: Parameter['name']
        type: `tuple[${Tail}]`
        components: TStructs[Head]
        internalType?: `struct ${Parameter['type']}`
      }
    : Parameter['type'] extends keyof TStructs
    ? {
        name: Parameter['name']
        type: 'tuple'
        components: TStructs[Parameter['type']]
        internalType?: `struct ${Parameter['type']}`
      }
    : Options['throwUnknownType'] extends true
    ? {
        name: Parameter['name']
        type: `Error: Unknown type "${Parameter['type']}"`
      }
    : Parameter
  : never

export type ParseAbiParameters<
  T extends string,
  TStructs extends StructMap | unknown = unknown,
> = T extends ''
  ? []
  : Split<T, ','> extends infer Inputs extends string[]
  ? {
      [K in keyof Inputs]: ParseAbiParameter<Trim<Inputs[K]>, TStructs>
    }
  : []

export type ParseAbi<TSignatures extends readonly Signature[]> =
  ParseStructs<TSignatures> extends infer Structs
    ? {
        [K in keyof TSignatures]: TSignatures[K] extends infer Signature extends string
          ? IsFunctionSignature<Signature> extends true
            ? ParseFunction<Signature, Structs>
            : never
          : never
      } extends infer Abi extends readonly unknown[]
      ? Filter<Abi, never>
      : []
    : never
