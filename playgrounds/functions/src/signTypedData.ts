import {
  type ResolvedRegister,
  type TypedData,
  type TypedDataDomain,
  type TypedDataToPrimitiveTypes,
} from 'abitype'

export declare function signTypedData<
  const typedData extends TypedData | Record<string, unknown>, // `Record<string, unknown>` allows for non-const asserted types
  primaryType extends keyof typedData,
>(
  parameters: SignTypedDataParameters<typedData, primaryType>,
): SignTypedDataReturnType

export type SignTypedDataParameters<
  typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData,
  ///
  schema extends Record<string, unknown> = typedData extends TypedData
    ? TypedDataToPrimitiveTypes<typedData>
    : { [_: string]: any },
  message extends schema[keyof schema] = schema[primaryType extends keyof schema
    ? primaryType
    : keyof schema],
> = {
  domain: TypedDataDomain
  primaryType:
    | primaryType // infer value
    | keyof typedData // show all values
  types: typedData
  message: { [_: string]: any } extends message // Check if message was inferred
    ? Record<string, unknown>
    : message
}

export type SignTypedDataReturnType = ResolvedRegister['BytesType']['outputs']
