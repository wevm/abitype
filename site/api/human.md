# Human-Readable ABI

Human-Readable ABIs compress JSON ABIs into signatures that are nicer to read and write. For example:

```ts
const abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
] as const
```

TODO: document

- tuples/structs
- utilities
- types
