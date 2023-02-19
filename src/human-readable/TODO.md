- Runtime implementations for `parse*(…)`
- Docs
- Separate entrypoint for human-readable ABI types/utils?

Improvements to signature validation:

- `returns` keyword
- whitespace between keywords
- `override Contract`
- `virtual`
- Validate function, event, and error params (e.g. missing comma) (can use for `parseAbiParameter`/`parseAbiParameters`)
- Validate struct properties (e.g. missing semi-colon)
