---
"abitype": patch
---

Fixed a bug on `formatAbiParameter` where it would infer incorrectly if the nested elements of the `components` property had no `name` property and the `type` property was of type `tuple` type.

Before:

```ts
type test = FormatAbiParameter<{
//   ^? test = "(tuple)"
  type: "tuple";
  components: [{ type: "tuple"; components: [{ type: "string" }] }];
}>;
```

After:

```ts
type test = FormatAbiParameter<{
//   ^? type test = "((string))"
  type: "tuple";
  components: [{ type: "tuple"; components: [{ type: "string" }] }];
}>;
```
