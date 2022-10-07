---
'abitype': patch
---

Set `ArrayMaxDepth` default to `false` so there is no maximum array depth. Added new configuration option `StrictAbiType` for validating `AbiParameter`'s `type`. Defaults to `false` so `AbiParameter['type']` is `string` instead of a large union.
