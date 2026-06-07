import type * as a from 'abitype'

export declare function watchEvent<
  const abi extends a.abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  eventName extends string,
>(parameters: WatchEventParameters<abi, eventName>): WatchEventReturnType

export type WatchEventParameters<
  abi extends a.abi | readonly unknown[],
  eventName extends string,
  ///
  eventNames extends string = abi extends a.abi
    ? a.abi.events.names<abi>
    : string,
  abiEvent extends a.abi.events.item = abi extends a.abi
    ? a.abi.events.extract<abi, eventName>
    : a.abi.events.item,
  primitiveTypes = a.abi.parameters.infer<abiEvent['inputs'], 'inputs', true>,
> = {
  abi: abi
  eventName:
    | eventNames // show all values
    | (eventName extends eventNames ? eventName : never) // infer value (if valid)
    | (a.abi extends abi ? string : never) // fallback if `abi` is declared as `Abi`
  onEmit: a.abi extends abi
    ? (...args: unknown[]) => void // `abi` declared as `Abi`
    : abi extends a.abi
      ? (
          // `abi` was inferrable
          ...args: primitiveTypes extends readonly unknown[]
            ? primitiveTypes
            : unknown[]
        ) => void
      : (...args: unknown[]) => void // fallback
}

export type WatchEventReturnType = () => void
