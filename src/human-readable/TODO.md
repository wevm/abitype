- Error handling: parseAbiParameter, parseAbiParameters, parseAbiItem, circular structs
- Loads of tests
- tsup entrypoints script
- Add TSDoc
- Check if Zod updates needed
- Docs with vitepress

Improvements to signature validation:

- Make `returns` keyword more robust
- Validate return AbiParameters against `{ type: AbiType }`
- Validate function, event, and error params (e.g. missing comma) (can use for `parseAbiParameter`/`parseAbiParameters`)
- Validate struct properties (e.g. missing semi-colon)
- whitespace between keywords
- Support `override Contract`
- Support `virtual`
