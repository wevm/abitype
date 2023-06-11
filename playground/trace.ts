import { parseAbi } from 'abitype'
import { seaportHumanReadableAbi } from 'abitype/test'

import { read } from '../examples/read.js'

// open trace in https://ui.perfetto.dev
const result = read({
  abi: parseAbi(seaportHumanReadableAbi),
  functionName: 'getOrderStatus',
  args: ['0x'],
})
result
