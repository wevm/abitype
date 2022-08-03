# abitype

TypeScript definitions for Ethereum ABIs. It provides autocompletion and type checking for ABI properties and values.

## Todo

- [ ] Organize code into different files
- [ ] Handle function overrides (make non-shared params optional?)
- [ ] Add test for tuple return type from function
- [ ] Add test case for list of `AbiFunction`s (e.g. `readContracts`)
- [ ] Utilities for `AbiEvent`
- [ ] Add support for dynamic (`<type>[]`) and fixed (`<type>[M]`) sized arrays of primitive types
- [ ] Add validation for `M` in number types (e.g. [`0 < M <= 256`](https://github.com/type-challenges/type-challenges/blob/main/questions/00734-extreme-inclusive-range/README.md) in `uint<M>`), `function` (identical to `bytes24`; an address (20 bytes) followed by a function selector (4 bytes)), etc.
- [ ] jsdoc @example
- [ ] Boost coverage
- [ ] Update README, contributing guide, etc.

## Open questions

- [ ] Should we inject payable value into function parameters?
- [ ] Should we allow configuration of a "BigNumberish" type? So folks can pass in `ethers.BigNumber`, `BigInt`, etc.

https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#types
