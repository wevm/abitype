import type {
  Abi,
  AbiEvent,
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from 'abitype'

export declare function watchEvent<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  eventName extends string,
>(parameters: WatchEventParameters<abi, eventName>): WatchEventReturnType

export type WatchEventParameters<
  abi extends Abi | readonly unknown[],
  eventName extends string,
  ///
  eventNames extends string = abi extends Abi
    ? ExtractAbiEventNames<abi>
    : string,
  abiEvent extends AbiEvent = abi extends Abi
    ? ExtractAbiEvent<abi, eventName>
    : AbiEvent,
  primitiveTypes = AbiParametersToPrimitiveTypes<abiEvent['inputs'], 'inputs'>,
> = {
  abi: abi
  eventName:
    | eventNames // show all values
    | (eventName extends eventNames ? eventName : never) // infer value (if valid)
    | (Abi extends abi ? string : never) // fallback if `abi` is declared as `Abi`
  onEmit: Abi extends abi
    ? (...args: unknown[]) => void // `abi` declared as `Abi`
    : abi extends Abi
      ? (
          // `abi` was inferrable
          ...args: primitiveTypes extends readonly unknown[]
            ? primitiveTypes
            : unknown[]
        ) => void
      : (...args: unknown[]) => void // fallback
}

export type WatchEventReturnType = () => void
