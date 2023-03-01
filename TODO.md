### Human-readable type validation

- Circular structs
- Validate return AbiParameters against `{ type: AbiType }`
- Validate function, event, and error params (e.g. missing comma) (can use for `parseAbiParameter`/`parseAbiParameters`)
- Validate struct properties (e.g. missing semi-colon)
