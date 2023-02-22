- parseAbiItem
- parseAbiConstructor
- parseAbiEvent
- parseAbiError
- parseAbiFallback
- parseAbiFunction
- parseAbi
- Cache signatures

- Add seaport abi [https://docs.opensea.io/reference/seaport-interface](https://docs.opensea.io/reference/seaport-interface)
- Separate entrypoint for human-readable ABI types/utils?
- Docs with vitepress
- Add TSDoc to parse utils

Improvements to signature validation:

- Make `returns` keyword more robust
- Validate return AbiParameters against `{ type: AbiType }`
- Validate function, event, and error params (e.g. missing comma) (can use for `parseAbiParameter`/`parseAbiParameters`)
- Validate struct properties (e.g. missing semi-colon)
- whitespace between keywords
- Support `override Contract`
- Support `virtual`
