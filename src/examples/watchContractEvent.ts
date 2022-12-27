import type { Abi, AbiEvent, Address } from '../abi'
import type { Narrow } from '../narrow'
import type {
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from '../utils'

export declare function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
>(config: GetConfig<TAbi, TEventName>): void

type GetConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
> = {
  /** Contract ABI */
  abi: Narrow<TAbi> // infer `TAbi` type for inline usage
  /** Contract address */
  address: Address
  /** Function to invoke on the contract */
  eventName: GetEventName<TAbi, TEventName>
} & GetListener<TAbi, TEventName>

type GetEventName<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
> = TAbi extends Abi
  ? ExtractAbiEventNames<TAbi> extends infer AbiEventNames
    ?
        | AbiEventNames
        | (TEventName extends AbiEventNames ? TEventName : never)
        | (Abi extends TAbi ? string : never)
    : never
  : TEventName

type GetListener<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
  TAbiEvent extends AbiEvent = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : AbiEvent,
  TArgs = AbiParametersToPrimitiveTypes<TAbiEvent['inputs']>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Callback when event is emitted
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      listener: (...args: unknown[]) => void
    }
  : {
      /** Callback when event is emitted */ listener: (
        ...args: TArgs extends readonly unknown[] ? TArgs : unknown[]
      ) => void
    }
