import type { AbiStateMutability } from '../abi'
import type { Split, Trim } from '../types'
import type {
  ConstructorSignature,
  FallbackSignature,
  ReceiveSignature,
} from './signatures'
import type { StructMap } from './structs'
import type { ParseAbiParameters } from './utils'

export type ParseAbiStateMutability<T extends string> =
  T extends `${string})${infer TReturn}`
    ? Extract<
        Split<TReturn, ' '>[number],
        AbiStateMutability
      > extends infer TAbiStateMutability
      ? [TAbiStateMutability] extends [never]
        ? 'nonpayable'
        : TAbiStateMutability
      : never
    : never

export type ParseFunction<
  TSignature extends string,
  TStructs extends StructMap | unknown = unknown,
> =
  // TODO: Function matching that supports tuples
  | (TSignature extends `function ${infer Name}(${infer Params})${infer Return}`
      ? {
          name: Trim<Name>
          type: 'function'
          stateMutability: ParseAbiStateMutability<TSignature>
          inputs: ParseAbiParameters<Params, TStructs>
          outputs: Trim<Return> extends `${string}returns (${infer Outputs})`
            ? ParseAbiParameters<Outputs, TStructs>
            : []
        }
      : never)
  | (Trim<TSignature> extends ConstructorSignature<infer Params>
      ? {
          type: 'constructor'
          inputs: ParseAbiParameters<Params, TStructs>
        }
      : never)
  | (Trim<TSignature> extends FallbackSignature
      ? {
          type: 'fallback'
          inputs?: []
        }
      : never)
  | (Trim<TSignature> extends ReceiveSignature
      ? {
          type: 'receive'
          stateMutability: 'payable'
        }
      : never)
