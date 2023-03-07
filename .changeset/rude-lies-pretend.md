---
'abitype': patch
---

Bug fixes:

- Fixed `splitParameters` parsing behavior for tuples with too many closing or opening parentheses.
- Fixed modifiers parsing for `error`, `event`, `struct` signatures.
- Stopped allowing protected Solidity keywords as parameter names.
