import type { Abi, Address } from '../abi.js'
import type { Narrow } from '../narrow.js'
import type { Error } from '../types.js'
import { InvalidBytecodeError } from './errors/invalidBytecode.js'
import {
  parseConstructor,
  parseErrorSelectors,
  parseEventSelectors,
  parseFunctionSelectors,
} from './runtime/selectors.js'
import type {
  ParseBytecodeConstructor,
  ParseBytecodeErrors,
  ParseBytecodeEvents,
  ParseBytecodeFunctions,
} from './types/bytecode.js'

export type ParseBytecode<T extends string> = string extends T
  ? Abi
  : readonly [
      ...ParseBytecodeConstructor<T>,
      ...ParseBytecodeErrors<T>,
      ...ParseBytecodeEvents<T>,
      ...ParseBytecodeFunctions<T>,
    ] extends infer Result
  ? Result extends readonly []
    ? Error<['Cannot infer abi from provided bytecode']>
    : Result
  : never

export function parseBytecode<
  TBytecode extends string,
  TResolvedSelectors extends Map<Address, string>,
>(
  bytecode: Narrow<TBytecode>,
  resolvedSelectors?: TResolvedSelectors,
): ParseBytecode<TBytecode> {
  const constructor = parseConstructor(bytecode as string)

  const parsedBytecode = constructor
    ? [
        constructor,
        ...parseErrorSelectors(bytecode as string, resolvedSelectors),
        ...parseEventSelectors(bytecode as string, resolvedSelectors),
        ...parseFunctionSelectors(bytecode as string, resolvedSelectors),
      ]
    : [
        ...parseErrorSelectors(bytecode as string, resolvedSelectors),
        ...parseEventSelectors(bytecode as string, resolvedSelectors),
        ...parseFunctionSelectors(bytecode as string, resolvedSelectors),
      ]

  if (typeof parsedBytecode[parseBytecode.length - 1] === 'undefined')
    throw new InvalidBytecodeError()

  return parsedBytecode as unknown as ParseBytecode<TBytecode>
}
