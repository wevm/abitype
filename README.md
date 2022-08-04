# abitype

TypeScript definitions for Ethereum ABIs. It provides autocompletion and type checking for ABI properties and values.

## Todo

- [ ] Add test case for list of `AbiFunction`s (e.g. `readContracts`)
- [ ] Export all types
- [ ] Utilities for `AbiEvent`

- [ ] Handle function overrides (make non-shared params optional?)
- [ ] Update README, contributing guide, issue templates, etc.

## Open questions

- [ ] Should we inject payable value into function parameters?
- [ ] Should we allow configuration of a "BigNumberish" type? So folks can pass in `ethers.BigNumber`, `BigInt`, etc.

## Usage

Must either declare/cast abi to `Abi` or use const assertion
