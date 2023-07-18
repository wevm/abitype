---
"abitype": patch
---

Fixed bug where type instantiation is excessively deep and possibly infinite when using `formatAbiParameter` with `exactOptionalPropertyTypes` set to `false`.
