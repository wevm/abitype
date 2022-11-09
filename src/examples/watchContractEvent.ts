import { Abi, AbiEvent, Address } from '../abi'
import { Narrow } from '../narrow'
import {
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from '../utils'
import { IsNever, NotEqual, Or } from './types'

type GetEventConfig<TContract> = TContract extends {
  abi: infer TAbi extends Abi
  eventName: infer TEventName extends string
}
  ? WatchContractEventConfig<
      TAbi,
      ExtractAbiEventNames<TAbi>,
      ExtractAbiEvent<TAbi, TEventName>
    >
  : TContract extends {
      abi: infer TAbi extends readonly unknown[]
      eventName: infer TEventName extends string
    }
  ? WatchContractEventConfig<TAbi, TEventName>
  : WatchContractEventConfig

type WatchContractEventConfig<
  TAbi = unknown,
  TEventName extends string = string,
  TAbiEvent extends AbiEvent = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : never,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: Narrow<TAbi>
  /** Event to listen for */
  eventName: IsNever<TEventName> extends true ? string : TEventName
} & (AbiParametersToPrimitiveTypes<
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
  : never)

export function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
>(_config: GetEventConfig<{ abi: TAbi; eventName: TEventName }>) {
  return
}
