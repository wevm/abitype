- Runtime implementations for `parse*(…)`
- Docs
- Separate entrypoint for human-readable ABI types/utils?

Improvements to signature validation:

- Add `@description` everywhere
- `returns` keyword
- Validate return AbiParameters against `{ type: AbiType }`
- Validate function, event, and error params (e.g. missing comma) (can use for `parseAbiParameter`/`parseAbiParameters`)
- Validate struct properties (e.g. missing semi-colon)
- whitespace between keywords
- `override Contract`
- `virtual`
