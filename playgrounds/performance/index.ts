import { parseAbi } from 'abitype'
import { seaportHumanReadableAbi } from 'abitype/abis'

// open `out/trace.json` in https://ui.perfetto.dev
const result = parseAbi(seaportHumanReadableAbi)
result[0]
