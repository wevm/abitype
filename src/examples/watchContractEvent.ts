import type { Abi, AbiEvent, AbiParameter, Address } from '../abi'
import type { Narrow } from '../narrow'
import type {
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from '../utils'

export declare function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
>(_config: GetConfig<{ abi: TAbi; eventName: TEventName }>): void

type GetConfig<TContract extends Contract = Contract> = TContract extends {
  abi: infer TAbi extends Abi
  eventName: infer TEventName extends string
}
  ? Abi extends TAbi
    ? Config
    : Config<
        TAbi,
        ExtractAbiEventNames<TAbi>,
        ExtractAbiEvent<TAbi, TEventName>
      >
  : TContract extends {
      abi: infer TAbi extends readonly unknown[]
      eventName: infer TEventName extends string
    }
  ? Config<TAbi, TEventName>
  : Config

type Contract<
  TAbi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  TEventName extends string = string,
> = { abi: TAbi; eventName: TEventName }

type Config<
  TAbi = unknown,
  TEventName extends string = string,
  TAbiEvent extends AbiEvent = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : never,
> = {
  /** Contract ABI */
  abi: Narrow<TAbi>
  /** Contract address */
  address: Address
  /** Event to listen for */
  eventName: TEventName
} & GetListener<TAbiEvent>

type GetListener<TAbiEvent extends AbiEvent> = AbiParametersToPrimitiveTypes<
  TAbiEvent['inputs']
> extends infer TArgs extends readonly unknown[]
  ? Or<
      Equal<readonly AbiParameter[], TAbiEvent['inputs']>,
      IsNever<TArgs>
    > extends true
    ? {
        /**
         * Callback when event is emitted
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
         */
        listener: (...args: unknown[]) => void
      }
    : {
        /** Callback when event is emitted */
        listener: (...args: TArgs) => void
      }
  : never

type Equal<T, U> = [T] extends [U] ? true : false
type IsNever<T> = [T] extends [never] ? true : false
type Or<T, U> = T extends true ? true : U extends true ? true : false
