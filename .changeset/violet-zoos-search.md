---
"abitype": patch
---

Fixed a bug on `formatAbiParameter` where it would infer incorrectly the nested elements of the `components` property if it had no `name` property.

Before:

```ts
type test = FormatAbiParameter<{
  type: "tuple";
  components: [{ type: "tuple"; components: [{ type: "string" }] }];
}>;
//    ^? '(tuple)'
```

After:

```ts
type test = FormatAbiParameter<{
  type: "tuple";
  components: [{ type: "tuple"; components: [{ type: "string" }] }];
}>;
//    ^? '((string))'
```
