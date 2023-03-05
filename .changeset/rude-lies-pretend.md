---
'abitype': patch
---

Fixes a bug where splitParameters was incorrectly parsing tuples with too many closing or opening parenthesis.
Fixes a bug where invalid modifiers where being parsed on error, struct, and event signatures.
Fixes a bug where it was possible to parse protected Solidity keywords.
Fixes a bug where you could use calldata, memory, and storage on non array types. (strings and bytes are treated as array type in solidity).
