import { FormatTypes, Interface as InterfaceV5 } from '@ethersproject/abi'
import { Interface } from 'ethers'
import { bench, describe } from 'vitest'

import { wagmiMintExampleHumanReadableAbi } from '../../test'
import { parseAbi } from './parseAbi'

describe('Parse ABI', () => {
  bench('abitype', () => {
    parseAbi(wagmiMintExampleHumanReadableAbi)
  })

  bench('ethers@6', () => {
    const iface = new Interface(wagmiMintExampleHumanReadableAbi)
    iface.formatJson()
  })

  bench('ethers@5', () => {
    const iface = new InterfaceV5(wagmiMintExampleHumanReadableAbi)
    iface.format(FormatTypes.json)
  })
})
