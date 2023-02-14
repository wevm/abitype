////////////////////////////////////////////////////////////////////////////////////////////////////
// Function Signatures

export type FunctionSignature<
  TName extends string = string,
  TParams extends string = string,
  TReturn extends string = string,
> =
  | FunctionSignatureWithoutReturn<TName, TParams>
  | FunctionSignatureWithReturn<TName, TParams, TReturn>
export type FunctionSignatureWithoutReturn<
  TName extends string = string,
  TParams extends string = string,
> = `function ${TName}(${TParams})`
export type FunctionSignatureWithReturn<
  TName extends string = string,
  TParams extends string = string,
  TReturn extends string = string,
> = `function ${TName}(${TParams}) ${TReturn}`

export type IsFunctionSignature<TSignature extends string> =
  TSignature extends FunctionSignature<infer TName extends string>
    ? TName extends ''
      ? false
      : true
    : false

export type ConstructorSignature<TParams extends string = string> =
  `constructor(${TParams})`
export type IsConstructorSignature<TSignature extends string> =
  TSignature extends ConstructorSignature ? true : false

export type FallbackSignature = 'fallback()'
export type IsFallbackSignature<TSignature extends string> =
  TSignature extends FallbackSignature ? true : false

export type ReceiveSignature = 'receive() external payable'
export type IsReceiveSignature<TSignature extends string> =
  TSignature extends ReceiveSignature ? true : false

////////////////////////////////////////////////////////////////////////////////////////////////////
// Event Signatures

export type EventSignature<
  TName extends string = string,
  TParams extends string = string,
> = `event ${TName}(${TParams})`
export type IsEventSignature<TSignature extends string> =
  TSignature extends EventSignature<infer Name>
    ? Name extends ''
      ? false
      : true
    : false

////////////////////////////////////////////////////////////////////////////////////////////////////
// Error Signatures

export type ErrorSignature<
  TName extends string = string,
  TParams extends string = string,
> = `error ${TName}(${TParams})`
export type IsErrorSignature<TSignature extends string> =
  TSignature extends ErrorSignature<infer Name>
    ? Name extends ''
      ? false
      : true
    : false

////////////////////////////////////////////////////////////////////////////////////////////////////
// Struct Signatures

export type StructSignature<
  TName extends string = string,
  TProperties extends string = string,
> = `struct ${TName}{${TProperties}}`
export type IsStructSignature<TSignature extends string> =
  TSignature extends StructSignature<infer Name>
    ? Name extends ''
      ? false
      : true
    : false

////////////////////////////////////////////////////////////////////////////////////////////////////
// Signature Types

export type Signature =
  | FunctionSignature
  | ConstructorSignature
  | FallbackSignature
  | ReceiveSignature
  | EventSignature
  | ErrorSignature
  | StructSignature
export type IsSignature<TSignature extends string> =
  | IsFunctionSignature<TSignature>
  | IsConstructorSignature<TSignature>
  | IsFallbackSignature<TSignature>
  | IsReceiveSignature<TSignature>
  | IsEventSignature<TSignature>
  | IsErrorSignature<TSignature>
  | IsStructSignature<TSignature>
