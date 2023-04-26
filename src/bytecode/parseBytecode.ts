import type { Address } from "../abi";
import {
  parseConstructor,
  parseErrorSelectors,
  parseEventSelectors,
  parseFunctionSelectors,
} from "./runtime/selectors";
import type { ParseBytecode } from "./types/bytecode";

export function parseBytecode<
  TBytecode extends string,
  TResolvedSelectors extends Map<Address, string>
>(
  bytecode: TBytecode,
  resolvedSelectors?: TResolvedSelectors
): ParseBytecode<TBytecode> {
  return [
    parseConstructor(bytecode),
    ...parseErrorSelectors(bytecode, resolvedSelectors),
    ...parseEventSelectors(bytecode, resolvedSelectors),
    ...parseFunctionSelectors(bytecode, resolvedSelectors),
  ] as unknown as ParseBytecode<TBytecode>;
}
