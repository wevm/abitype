---
'abitype': minor
---

**Breaking**: Changed `BytesType` configuration property to support ABI item inputs and outputs types. To keep the previous behavior set `BytesType` to the following:

```ts
declare module 'abitype' {
  BytesType: {
    inputs: `0x${string}`
    outputs: `0x${string}`
  }
}
```

`BytesType['inputs']` default is now `` `0x${string}` | Uint8Array `` instead of just `` `0x${string}` ``.
