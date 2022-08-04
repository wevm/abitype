# abitype

TypeScript definitions for Ethereum ABIs. It provides autocompletion and type checking for ABI properties and values.

## Todo

- [ ] Add test case for list of `AbiFunction`s (e.g. `readContracts`)
- [ ] Utilities for `AbiEvent`, `AbiError`
- [ ] Add docs to README.md

## Open questions

- [ ] Should we allow configuration of a "BigNumberish" type? So folks can pass in `ethers.BigNumber`, `BigInt`, etc.
- [ ] How to handle function overrides? Make non-shared params optional?
- [ ] Should we inject payable value into function parameters?

## Usage

- Must either declare/cast abi to `Abi` or use const assertion

## Caveats

- Fixed arrays not supported (e.g. `string[M]`)
