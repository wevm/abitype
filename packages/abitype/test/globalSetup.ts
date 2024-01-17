import { cleanup, setup } from '@arktype/attest'

// https://github.com/arktypeio/arktype/tree/beta/ark/attest#readme
export default function () {
  setup()
  return cleanup
}
