---
'abitype': minor
---

Refactored `AbiFunction` into `AbiConstructor`, `AbiFallback`, `AbiFunction`, and `AbiReceive`.

`AbiFunction` (e.g. `type: 'function'`) was frequently used and the only way to narrow that specific type from the others (e.g. `type: 'constructor' | 'fallback' | 'receive'`) was to add a bunch of `& { type: 'function' }` to the `AbiFunction` type.

Changed default value of `BytesType['inputs']` back to `` `0x${string}` ``. This ends up being the most strict and sensible default so you can opt in to handling `Uint8Array` (or any other type) instead of opting out of it.
