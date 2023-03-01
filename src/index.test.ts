import { expect, it } from 'vitest'

import * as Exports from './'

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "parseHumanAbiFunctions",
      "parseHumanAbi",
      "parseHumanAbiFallbacks",
      "parseHumanAbiEvents",
      "parseHumanAbiErrors",
      "parseHumanAbiConstructor",
      "narrow",
      "parseAbi",
      "parseAbiItem",
      "parseAbiParameter",
      "parseAbiParameters",
    ]
  `)
})
