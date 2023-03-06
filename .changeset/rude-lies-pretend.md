---
'abitype': patch
---

Fixed a bug, where `splitParameters` was incorrectly parsing tuples with too many closing or opening parenthesis.
Fixed a bug, where invalid modifiers were being parsed on `error`, `struct`, and `event` signatures.
Fixed a bug, where it was possible to parse protected Solidity keywords.
Fixed a bug, where you could use `calldata`, `memory`, and `storage` on non array types. (`strings` and `bytes` are treated as array types in solidity).
