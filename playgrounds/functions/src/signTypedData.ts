import type * as a from 'abitype'

export declare function signTypedData<
  const typedData extends a.typedData.root | Record<string, unknown>, // `Record<string, unknown>` allows for non-const asserted types
  primaryType extends keyof typedData,
>(
  parameters: SignTypedDataParameters<typedData, primaryType>,
): SignTypedDataReturnType

export type SignTypedDataParameters<
  typedData extends a.typedData.root | Record<string, unknown>,
  primaryType extends keyof typedData,
  ///
  schema extends Record<string, unknown> = typedData extends a.typedData.root
    ? a.typedData.infer<typedData>
    : { [_: string]: any },
  message extends schema[keyof schema] = schema[primaryType extends keyof schema
    ? primaryType
    : keyof schema],
> = {
  domain: a.typedData.domain
  primaryType:
    | primaryType // infer value
    | keyof typedData // show all values
  types: typedData
  message: { [_: string]: any } extends message // Check if message was inferred
    ? Record<string, unknown>
    : message
}

export type SignTypedDataReturnType = a.resolvedRegister['bytesType']['outputs']
