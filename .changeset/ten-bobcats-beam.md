---
"abitype": patch
---

Fixed a bug on `TypedDataToPrimitiveTypes` where it would create an infinite cyclic type if the `type` was an array type of `keyof TypedData`.
