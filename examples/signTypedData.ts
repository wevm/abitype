import {
  type ResolvedConfig,
  type ResolvedTypedData,
  type ResolvedTypedDataToPrimativeType,
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

export type SignTypedDataReturnType = ResolvedConfig['BytesType']['outputs']

export declare function signTypedDataV2<
  const typedData extends ResolvedTypedData | Record<string, unknown>, // `Record<string, unknown>` allows for non-const asserted types
  primaryType extends keyof typedData,
>(
  parameters: SignTypedDataParametersV2<typedData, primaryType>,
): SignTypedDataReturnType

export type SignTypedDataParametersV2<
  typedData extends ResolvedTypedData | Record<string, unknown>,
  primaryType extends keyof typedData,
  ///
  schema extends Record<string, unknown> = typedData extends ResolvedTypedData
    ? ResolvedTypedDataToPrimativeType<typedData>
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
