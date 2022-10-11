import { Abi, AbiEvent, AbiParameter, Address } from '../abi'
import {
  AbiParameterToPrimitiveType,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from '../utils'
import { IsNever, NotEqual, Or } from './types'

type AbiEventParametersToPrimitiveTypes<
  TAbiParameters extends readonly (AbiParameter & {
    indexed?: boolean
  })[],
> = {
  // TODO: Convert to labeled tuple so parameter names show up in autocomplete
  // e.g. [foo: string, bar: string]
  // https://github.com/microsoft/TypeScript/issues/44939
  [K in keyof TAbiParameters]:
    | AbiParameterToPrimitiveType<TAbiParameters[K]>
    // If event is not indexed, add `null` to type
    | (TAbiParameters[K]['indexed'] extends true ? never : null)
}

type GetListener<
  TAbiEvent extends AbiEvent,
  TAbi = unknown,
> = AbiEventParametersToPrimitiveTypes<
  TAbiEvent['inputs']
> extends infer TArgs extends readonly unknown[]
  ? // If `TArgs` is never or `TAbi` does not have the same shape as `Abi`, we were not able to infer args.
    Or<IsNever<TArgs>, NotEqual<TAbi, Abi>> extends true
    ? {
        /**
         * Callback when event is emitted
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
         */
        listener: (...args: unknown[]) => void
      }
    : // We are able to infer args, spread the types.
      {
        /** Callback when event is emitted */
        listener: (...args: TArgs) => void
      }
  : never

type WatchContractEventConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
  TAbiEvent extends AbiEvent = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : never,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Event to listen for */
  eventName: TEventName
} & GetListener<TAbiEvent, TAbi>

type GetEventConfig<T> = T extends {
  abi: infer TAbi extends Abi
  eventName: infer TEventName extends string
}
  ? WatchContractEventConfig<
      TAbi,
      ExtractAbiEventNames<TAbi>,
      ExtractAbiEvent<TAbi, TEventName>
    >
  : T extends {
      abi: infer TAbi extends readonly unknown[]
      eventName: infer TEventName extends string
    }
  ? WatchContractEventConfig<TAbi, TEventName>
  : WatchContractEventConfig

export function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
>(_config: GetEventConfig<{ abi: TAbi; eventName: TEventName }>) {
  return
}
