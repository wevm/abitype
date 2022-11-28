---
'abitype': patch
---

Fixed `abitype/zod` support for legacy contracts, like WETH, by making `inputs` optional for `type: 'fallback'` and `AbiError` `type` from `"event"` to `"error"`.
