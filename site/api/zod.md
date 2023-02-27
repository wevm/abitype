# Zod

ABIType exports the core types as [Zod](https://github.com/colinhacks/zod) schemas from the `abitype/zod` entrypoint. Install required peer dependency:

```ts
npm install zod
pnpm add zod
yarn add zod
```

Then, import and use schemas:

```ts
import { Abi } from 'abitype/zod'

const result = await fetch(
  'https://api.etherscan.io/api?module=contract&action=getabi&address=0x…',
)
const abi = Abi.parse(result)
```
