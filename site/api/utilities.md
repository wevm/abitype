# Utilities

## `AbiParameterToPrimitiveType`

Converts `AbiParameter` to corresponding TypeScript primitive type.

| Name                | Description                                        | Type                          |
| ------------------- | -------------------------------------------------- | ----------------------------- |
| `TAbiParameter`     | Parameter to convert to TypeScript representation. | `AbiParameter`                |
| `TAbiParameterKind` | Kind to narrow by parameter type.                  | `AbiParameterKind` (optional) |
| returns             | TypeScript primitive type.                         | `TType` (inferred)            |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgQQEbAAoEMpZAUxnygBUIMpRgZgA3fEgTzHzgF84AzKCEOAcizoYzfPwBQ4kSzgAlfAGcArgBt4AXhTpsuAkVLlKIanQaiAPAnEB6a3HsA9APzj7AOzz4AXAIgB3N2IJe2lvASwAEwioRQUJNgA+IA)

```ts
import { AbiParameterToPrimitiveType } from 'abitype'

type Result = AbiParameterToPrimitiveType<{
  name: 'owner'
  type: 'address'
}>
```

## `AbiParametersToPrimitiveTypes`

Converts array of `AbiParameter` to corresponding TypeScript primitive types.

| Name                | Description                                          | Type                          |
| ------------------- | ---------------------------------------------------- | ----------------------------- |
| `TAbiParameters`    | Parameters to convert to TypeScript representations. | `readonly AbiParameter[]`     |
| `TAbiParameterKind` | Kind to narrow by parameter type.                    | `AbiParameterKind` (optional) |
| returns             | TypeScript primitive types.                          | `TType[]` (inferred)          |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgQQEbAAoEMpZAUxnygGcAVCDKUYGYAN3zIE8x8S4BfOAMyghBwA5FnQxW+IQCgp4tnABK7AK4AbeAF4U6bLgJFSFKjTqMWbEgB4pAehtwHAPQD8UhwG03DxF+9wAdnj4AFzCMBDSfg5yIcJYACbxUOwkkd6cADS+PlEBQaFC4QDW+P4AkvFpfjEFysD+MABMAKwAbFVcWQ4AulIAfEA)

```ts
import { AbiParametersToPrimitiveTypes } from 'abitype'

type Result = AbiParametersToPrimitiveTypes<
  [
    {
      name: 'to'
      type: 'address'
    },
    {
      name: 'tokenId'
      type: 'uint256'
    },
  ]
>
```

## `AbiTypeToPrimitiveType`

Converts `AbiType` to corresponding TypeScript primitive type.

| Name                | Description                                       | Type                          |
| ------------------- | ------------------------------------------------- | ----------------------------- |
| `TAbiType`          | ABI type to convert to TypeScript representation. | `AbiType`                     |
| `TAbiParameterKind` | Kind to narrow by parameter type.                 | `AbiParameterKind` (optional) |
| returns             | TypeScript primitive type.                        | `TType` (inferred)            |

> **Note**
>
> Does not include full array or tuple conversion. Use [`AbiParameterToPrimitiveType`](#abiparametertoprimitivetype) to fully convert array and tuple types.

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgQQEbACoE8wFMMQAKUowMwAbvjrnAL5wBmUEIcA5AIbow3sBQ-XnjgAlXAGcArgBt4AXhTpseAsVLkqK3AB4uAE31RJE9gD5+AektxbAPQD8QA)

```ts
import { AbiTypeToPrimitiveType } from 'abitype'

type Result = AbiTypeToPrimitiveType<'address'>
```

## `ExtractAbiError`

Extracts `AbiError` with name from `Abi`.

| Name         | Description    | Type                |
| ------------ | -------------- | ------------------- |
| `TAbi`       | ABI.           | `Abi`               |
| `TErrorName` | Name of error. | `string` (inferred) |
| returns      | ABI Error.     | `AbiError`          |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwyUU0cAvnAGZkhwDkmRMAnmAKYMBQ32EAOwDO8ZsDgBeOAG1ucRHAGYQHAFyM8YMGQBumADYBhA-o5QAchBgB5AO4CzlqJu0QdHACYMANHDad1BjMyKB84YAEwAFcYIXVpAF1KbzkFJRVAl10DAEUos1YAMWhLB1RgEQ4BGAAVCABrKrD-NUZg6DCI6Nj4pIoUpMwhOH5hGF4WuAAlDiEo-XgpNAwcfCISEIAeFohqODFfBiy3XPyoIpLBDnLK6rrGgQYAPm4Aelf5OAA9AH5uIA)

```ts
import { ExtractAbiError } from 'abitype'

const abi = [
  { name: 'ApprovalCallerNotOwnerNorApproved', type: 'error', inputs: [] },
  { name: 'ApprovalQueryForNonexistentToken', type: 'error', inputs: [] },
] as const

type Result = ExtractAbiError<typeof abi, 'ApprovalQueryForNonexistentToken'>
```

## `ExtractAbiErrorNames`

Extracts all `AbiError` names from `Abi`.

| Name    | Description      | Type                |
| ------- | ---------------- | ------------------- |
| `TAbi`  | ABI.             | `Abi`               |
| returns | ABI Error names. | `string` (inferred) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwyUU0AcpiAKYDOcAvnAGZkhwDkmRMAnmNQ4AoIdggA7WvG7A4AXjgBtIXERxxVagC5OeMGDIA3TABsAwqZPUo5CDADyAd3HXbUPQYiHqAEw4AaOD4BHQ5rMigAuGBxMABXGFodRQBdRn8VNQ0aUI8jUwBFOOteADEKCWpUYClqcRgAFQgAazqo4O1OcOgomPjE5LSGDLTMejFJGBEOuAAlOjiTeAU0DBx8IhIIyhpaAB4OiGY4GQA+IQB6C9U4AD0AfiEgA)

```ts
import { ExtractAbiErrorNames } from 'abitype'

const abi = [
  { name: 'ApprovalCallerNotOwnerNorApproved', type: 'error', inputs: [] },
  { name: 'ApprovalQueryForNonexistentToken', type: 'error', inputs: [] },
] as const

type Result = ExtractAbiErrorNames<typeof abi>
```

## `ExtractAbiErrors`

Extracts all `AbiError` types from `Abi`.

| Name    | Description | Type               |
| ------- | ----------- | ------------------ |
| `TAbi`  | ABI.        | `Abi`              |
| returns | ABI Errors. | `AbiError` (union) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwyUU0AznAL5wBmZIcA5JkTAJ5gCmTAUL9ggA7cvFbA4AXjgBtXnERwhmEFwBczPGDBkAbpgA2AYUMGuUAHIQYAeQDuQ81ahadEXVwAmTADRwO3BpM5mRQvnDAQmAArjDkGjIAutQ+8orKqkGueoYAitHm7ABi0FaOqMCiXEIwACoQANbV4QHqzCHQ4ZExcQnJVKnJmJSCIjD8rXAASlzk0Qbw0mgYOPhEJKHkADytELRw4gB8vAD0JwpwAHoA-LxAA)

```ts
import { ExtractAbiErrors } from 'abitype'

const abi = [
  { name: 'ApprovalCallerNotOwnerNorApproved', type: 'error', inputs: [] },
  { name: 'ApprovalQueryForNonexistentToken', type: 'error', inputs: [] },
] as const

type Result = ExtractAbiErrors<typeof abi>
```

## `ExtractAbiEvent`

Extracts `AbiEvent` with name from `Abi`.

| Name         | Description    | Type                |
| ------------ | -------------- | ------------------- |
| `TAbi`       | ABI.           | `Abi`               |
| `TEventName` | Name of event. | `string` (inferred) |
| returns      | ABI Event.     | `AbiEvent`          |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwyAbgKYB28AvnAGZQQhwDkmRMAnmGSwFB9sECgGd47YHAC8cANp84iBYrgVMIMgC5WeMGEYlMAGxYAaZYq49tLMuSpmLcTBWGcQEAK4jtdYyLJzFThgCjBPGB85J0UkNQ0bCAB3CjIoMzgrLVZMABNcqDIREQzQ3LJUMlztDE8yOGog4MRVdWy2PQMqjKybPIKiktMQinLK6syoOoam4Li2mxgIAGtKAElcnu52z1CYACYAVgA2UtGKqpqp+sanAF0m29inePaAFSxROjTHYN7WOyUGC-FQuNweby+fyBJyhcKRbTyZotV42BhMLbWHL5QrFM5jS6TaZPZrzBKsJaY9r9XFDEYEia1G6zFRk9pLVYUDZUmy7KhHU7DMoXRnXGb3R7mO7OERwISiGACLJwABKRU8RngMjQGBw+CIpCBAB4shA6M4iMMWB8XCJvukAHx8AD0zpUAD0APx8IA)

```ts
import { ExtractAbiEvent } from 'abitype'

const abi = [
  {
    name: 'Approval',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'approved', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

type Result = ExtractAbiEvent<typeof abi, 'Transfer'>
```

## `ExtractAbiEventNames`

Extracts all `AbiEvent` names from `Abi`.

| Name    | Description      | Type                |
| ------- | ---------------- | ------------------- |
| `TAbi`  | ABI.             | `Abi`               |
| returns | ABI Error names. | `string` (inferred) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwyAbgKYB2MAcpiGQM5wC+cAZlBCHAOSZEwAnmDI8AUGOwQKDeP2BwAvHADaYuInUa4FOmQBcvPGDCcSmADY8ANFo1CRhnmXJUbduJgrTBICAFcGQzZLBjJbbThgCjB-GCDVDw0kXXonCAB3CjIoGzgHA15MABNiqEYGPOjislQyYsMMfzIWCMjEHT0nTBMzeryC7tLyhkrrKIoauob8qGbWpI7Uwp4YCABrSgBJYoHhFf9omAAmAFYANirJ2vrGuZbmNo0AXTbHrQQPZacAFSwZNg5dyRQa8FyUGDA7ReHx+QLBULhDzRWLxQxqdpLLq8DhcPaOIrDCpXKa3Wbzd6YlLY1YQfErEplYnjao3GZNB5PbTUtK8NabCg7elOQ5UM6XFnXaZ3Clc15ad7PTxMKQyGASApwABKjH8FngyjQGBw+CIpAhtHoDAAPAUIGxPEQAHxiAD0ru0AD0APxiIA)

```ts
import { ExtractAbiEventNames } from 'abitype'

const abi = [
  {
    name: 'Approval',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'approved', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

type Result = ExtractAbiEventNames<typeof abi>
```

## `ExtractAbiEvents`

Extracts all `AbiEvent` types from `Abi`.

| Name    | Description | Type               |
| ------- | ----------- | ------------------ |
| `TAbi`  | ABI.        | `Abi`              |
| returns | ABI Events. | `AbiEvent` (union) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwyAbgKYB2MAznAL5wBmUEIcA5JkTAJ5hnsAUIOwQK1eF2BwAvHADaguIiXK4FTCDIAuDnjBgWJTABt2AGlXLe-XezLkqFq3EwUxPEBACu1XY1NqMks1OGAKMG8aXUVQ5SQNLTsIAHcKMigLOBsdDkwAE3yoMmpqLPD8slQyfN0MbzJ6ELiEzVzOAyMarJy7AqKSsvMwikrq2uyoBqaXePU2uxgIAGtKAEl8nr5273CYACYAVgA2ctGqmrqpxrpm5QBdZtvVBBdE9oAVLHFGDOdQ3ocByUGD-NRuDxeXz+QLBFzhSLRBSzRDzJIcZisLa2PKFYqlM5jS6TabPOKo96LCDY9r9fFDEZEib1G53NStdHsJarCgbGl2XZUI6nYYVC7M64zUKPVTPe6uWiicQwYQ5OAAJRK3hM8DkaAwOHwRFIIOoAB4chBGK4iAA+QQAegdagAegB+QRAA)

```ts
import { ExtractAbiEvents } from 'abitype'

const abi = [
  {
    name: 'Approval',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'approved', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

type Result = ExtractAbiEvents<typeof abi>
```

## `ExtractAbiFunction`

Extracts `AbiFunction` with name from `Abi`.

| Name            | Description       | Type                |
| --------------- | ----------------- | ------------------- |
| `TAbi`          | ABI.              | `Abi`               |
| `TFunctionName` | Name of function. | `string` (inferred) |
| returns         | ABI Function.     | `AbiFunction`       |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwAYgK4B2uwE5cAvnAGZQQhwDkmRMAnmAKbsAUEOw0AzvC7A4AXjgBtIXETKVccphD8AXBwKYANpkr8A8o3YAaNSt4C97RhSo1rtuJMwx+AWVIw0obAvI4AbsD8AO7u6nDA5GAB4noKSJrajhBR5PxQ1nD2uhyYACalUPzi4uz0ALo2cRABSTApiulaxewGxqYFRY6kCTAATACsAGy1dA1qdI2qcRnd4piM-AAqWOTiG1DELCCx6oMczpQw1OQnKl4+-oFEwaEc5DRgmDxchoKLKglWu0lHEVJ1MucjgM+N0yhUqjV6P91ODujAINCHCVypVqjNkWCNF1HOiANb8cgASVKmO6w3IYym+I8cyaLWSqVZSKEdTgmHEcDEuxgIiKcAASlVSIZ4PI0BgcPgiGRLtcADxFCCMPlEKz6IwmbDmSwAPiEAHpzeoAHoAfiEQA)

```ts
import { ExtractAbiFunction } from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = ExtractAbiFunction<typeof abi, 'balanceOf'>
```

## `ExtractAbiFunctionNames`

Extracts all `AbiFunction` names from `Abi`.

| Name                  | Description           | Type                            |
| --------------------- | --------------------- | ------------------------------- |
| `TAbi`                | ABI.                  | `Abi`                           |
| `TAbiStateMutibility` | ABI state mutability. | `AbiStateMutability` (optional) |
| returns               | ABI Event names.      | `string` (inferred)             |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwAYgK4B2uwE5AcpiAKYDOcAvnAGZQQhwDkmIjACeYRvwBQk7DWbwhwOAF44AbUlxEmrXHINGALgEFMAG0yVGAeU78ANDq2jxx-pwpUaDp3HmYYRgBZUhhFM2BRNwA3YEYAdx9dOGByMFDmYzUkfSY3CHjyRigHOBcjAUwAEyqoFmZ+dgBdR2SIUPSYTPUcgzdTCytS8rdSVJgAJgBWADZGthadNlbtZNyK-mZMTkYAFSxyZh2oYh4QJN0RgQ9KGGpyC61-QJCwogiogXIaMEwRITMEhWWlSnW6GmSWl6eWuZ2GYg21Vq9XmwN00I2MAg8NclRqdWYDXYaKhej6AixAGtGOQAJJVHEbMbkSazVG+RZtDoZLKc4mSJpwTCsWSHGDScpwABKLFIZngqjQGBw+CIZFu93oTGYAB5yhBOEKiAA+SQAejNugAegB+SRAA)

```ts
import { ExtractAbiFunctionNames } from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = ExtractAbiFunctionNames<typeof abi>
```

## `ExtractAbiFunctions`

Extracts all `AbiFunction` types from `Abi`.

| Name    | Description    | Type                  |
| ------- | -------------- | --------------------- |
| `TAbi`  | ABI.           | `Abi`                 |
| returns | ABI Functions. | `AbiFunction` (union) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwAYgK4B2uwE5AznAL5wBmUEIcA5JkTAJ5gAppwBQI7DVrwewOAF44AbRFxEK1XHKYQggFxcCmADaZKggPLNOAGnWr+Q-Z2YUqNG3bhTMMQQFlSGBkjYH4nADdgQQB3Dw04YHIwQNp9RSQtHScIaPJBKBs4Bz0uTAATMqhBWlpORgBdW3iIQOSYVKUM7RLOQxMzQuKnUkSYACYAVgA2OoZG9QYmtXjMntpMZkEAFSw6TahiNhA4jSGuF0oYanIT1W9fAKCiELCuchowTD4eI2El1USbQ6yniqi6WXOR0GAh65Uq1VqjH+GnBPRgEGhjlKFSqNVmyLBmm6TnRAGtBOQAJJlTE9EbkcbTfGeebNVopNKspEiepwTD0CR0GBiYpwABK1VIRngCjQGBw+CIZEu11oAB5ihBmHyiAA+EQAegNGgAegB+ERAA)

```ts
import { ExtractAbiFunctions } from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = ExtractAbiFunctions<typeof abi>
```

By default, extracts all functions, but you can also filter by `AbiStateMutability`:

```ts
type Result = ExtractAbiFunctions<typeof erc721Abi, 'view'>
```

## `IsAbi`

Checks if type is `Abi`.

| Name    | Description                                           | Type      |
| ------- | ----------------------------------------------------- | --------- |
| `TAbi`  | ABI.                                                  | `Abi`     |
| returns | Boolean value. `true` if valid `Abi`, `false` if not. | `boolean` |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgSQM4EEBGw4F84BmUEIcA5AIbYwCeYApmQFBMDGEAdqvFTgLxwA2kziIRouBwoh6ALnKYKAGwodW9APIEyAGnGjaDeWQIBXNTGCdd+uNwox6AWVMxeS4LWMA3YPQDuNhJwwBxgrqjygkhSMsYQ-hz0ULpwhnLkFAAmWVD0qKhkeAC6esEQruEwkUIx0hlkiipqjDppdA2moTAATACsAGxFuKXiuGViwbENqBQE9AAqUKqo81AAYsQgQRLpxmYWVhw7ovaOLm7YHl7kHJxgFDRUSq22oVU1wsGidXHkRCRUntMjk8gVhhNgr8GjAIECOsZsrl8oU8JCJNDjLCANb0DjILLwozkLocXqDCG2UblSoRKLUtFMYpwCioODsLgwFjpOAAJXypiU8AEaCwwAAPOkIAQWdgAHxMAD0iokAD0APxMIA)

```ts
import { IsAbi } from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = IsAbi<typeof abi>
```

## `IsTypedData`

Checks if type is `TypedData`.

| Name         | Description                                                 | Type        |
| ------------ | ----------------------------------------------------------- | ----------- |
| `TTypedData` | EIP-712 Typed Data schema.                                  | `TypedData` |
| returns      | Boolean value. `true` if valid `TypedData`, `false` if not. | `boolean`   |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgSQM4BUCeYCmATAEQEMYi4BfOAMyghDgHIiAjYGbHBgKC4GMIAdqnjtcqOAF5EXOHAAKOKKkEAuOAG0ZsxHAFEQONQz0GGAGjijDjYVGACA5gwpmtspCesMA7kQA2fjgw5pYcRkR4eFA4qKjO5K6yALqJcACyRMB+apraOp5GNHQhVkYKSoLxqe66+l4wECVhjOXKAlVu+XVG-AIwOH1xFqU2MHaOHcmulETivcI8VnAASjEArn7wUmhYuIQkRAA8VhBUoWIAfFwA9NfaAHoA-FxAA)

```ts
import { IsTypedData } from 'abitype'

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
} as const

type Result = IsTypedData<typeof types>
```

## `TypedDataToPrimitiveTypes`

Converts [EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) `TypedData` to corresponding TypeScript primitive type.

| Name         | Description                          | Type                                   |
| ------------ | ------------------------------------ | -------------------------------------- |
| `TTypedData` | EIP-712 Typed Data schema.           | `TypedData`                            |
| returns      | TypeScript representation of schema. | `{ [name: string]: TType }` (inferred) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQJ5gKYBMAiBDGPZCABSlGBmADcM1MBnOAXzgDMoIQ4ByPAI0roMPAFCiAxhAB2DeDGFMAvIlFw4JDFAYyAXHADaa9YjjS8IDPp7nLPADRwFma3PLSA5jxb3j6pLZWvADueAA2YRgwDk7C1nhYWFAYDAzezL7qALqZcACyeMBh+kYmpoHWHFwxzkE8mtoy6bn+ZhZ1MBA1cbwNOtLNfuXt1lLSMBjjaY61rjDuXj7GOaKseExjcuK1cABKKQCuYfAq9Nj4hMRkFFS0ZwwAPLUQbLGMAHyiAPRfJgB6AH5REA)

```ts
import { TypedDataToPrimitiveTypes } from 'abitype'

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
} as const

type Result = TypedDataToPrimitiveTypes<typeof types>
```
