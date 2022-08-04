# abitype

TypeScript definitions for Ethereum ABIs. It provides autocompletion and type checking for ABI properties and values.

## Todo

- [ ] test utils
- [ ] add @example to utils
- [ ] Add test for tuple return type from function

- [ ] Add test case for list of `AbiFunction`s (e.g. `readContracts`)
- [ ] Handle function overrides (make non-shared params optional?)
- [ ] Utilities for `AbiEvent`
- [ ] Update README, contributing guide, issue templates, etc.

## Open questions

- [ ] Should we inject payable value into function parameters?
- [ ] Should we allow configuration of a "BigNumberish" type? So folks can pass in `ethers.BigNumber`, `BigInt`, etc.

## Usage

Must either declare/cast abi to `Abi` or use const assertion
