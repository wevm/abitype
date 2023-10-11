export type Register = {}

export type ResolvedRegister = {
  /**
   * TypeScript type to use for `address` values
   * @default `0x${string}`
   */
  AddressType: Register extends { AddressType: infer type }
    ? type
    : DefaultRegister['AddressType']
  /**
   * TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48`
   * @default bigint
   */
  BigIntType: Register extends { BigIntType: infer type }
    ? type
    : DefaultRegister['BigIntType']
  /**
   * TypeScript type to use for `bytes` values
   * @default { inputs: `0x${string}`; outputs: `0x${string}`; }
   */
  BytesType: Register extends {
    BytesType: infer type extends { inputs: unknown; outputs: unknown }
  }
    ? type
    : DefaultRegister['BytesType']
  /**
   * TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48`
   * @default number
   */
  IntType: Register extends { IntType: infer type }
    ? type
    : DefaultRegister['IntType']

  /**
   * Maximum depth for nested array types (e.g. string[][])
   *
   * Note: You probably only want to set this to a specific number if parsed types are returning as `unknown`
   * and you want to figure out why. If you set this, you should probably also reduce `FixedArrayMaxLength`.
   *
   * @default false
   */
  ArrayMaxDepth: Register extends {
    ArrayMaxDepth: infer type extends number | false
  }
    ? type
    : DefaultRegister['ArrayMaxDepth']
  /**
   * Lower bound for fixed array length
   * @default 1
   */
  FixedArrayMinLength: Register extends {
    FixedArrayMinLength: infer type extends number
  }
    ? type
    : DefaultRegister['FixedArrayMinLength']
  /**
   * Upper bound for fixed array length
   * @default 99
   */
  FixedArrayMaxLength: Register extends {
    FixedArrayMaxLength: infer type extends number
  }
    ? type
    : DefaultRegister['FixedArrayMaxLength']

  /**
   * When set, validates {@link AbiParameter}'s `type` against {@link AbiType}
   *
   * Note: You probably only want to set this to `true` if parsed types are returning as `unknown`
   * and you want to figure out why.
   *
   * @default false
   */
  StrictAbiType: Register extends { StrictAbiType: infer type extends boolean }
    ? type
    : DefaultRegister['StrictAbiType']
}

export type DefaultRegister = {
  /** Maximum depth for nested array types (e.g. string[][]) */
  ArrayMaxDepth: false
  /** Lower bound for fixed array length */
  FixedArrayMinLength: 1
  /** Upper bound for fixed array length */
  FixedArrayMaxLength: 99

  /** TypeScript type to use for `address` values */
  AddressType: `0x${string}`
  /** TypeScript type to use for `bytes` values */
  BytesType: {
    /** TypeScript type to use for `bytes` input values */
    inputs: `0x${string}`
    /** TypeScript type to use for `bytes` output values */
    outputs: `0x${string}`
  }
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48` */
  BigIntType: bigint
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48` */
  IntType: number

  /** When set, validates {@link AbiParameter}'s `type` against {@link AbiType} */
  StrictAbiType: false
}
