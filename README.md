# ABIType

[![npm](https://img.shields.io/npm/v/abitype.svg?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)
[![Downloads per month](https://img.shields.io/npm/dm/abitype?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)

TypeScript utilities and definitions for Ethereum ABIs. It provides autocompletion and type checking for ABI properties and values.

```ts
import { Abi, IsAbi, ExtractAbiFunctions } from 'abitype'

const erc20Abi: Abi = [...]

type Valid = IsAbi<typeof erc20Abi>
type Functions = ExtractAbiFunctions<typeof erc20Abi, 'nonpayable'>
```

## Installation

```bash
npm install abitype
```

## Usage

Must either declare/cast abi to `Abi` or use const assertion

## Support

If you find abitype useful, please consider supporting development. Thank you 🙏

- [GitHub Sponsors](https://github.com/sponsors/tmm?metadata_campaign=gh_readme_support)
- [Gitcoin Grant](https://gitcoin.co/grants/4493/wagmi-react-hooks-library-for-ethereum)
- [wagmi-dev.eth](https://etherscan.io/enslookup-search?search=wagmi-dev.eth)

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

[WAGMIT](/LICENSE) License
