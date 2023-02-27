import { test } from 'vitest'

import { parseParameters } from './utils'

test('Parse Parameters', () => {
  console.log(parseParameters('Hello,(Baby)'))
})
