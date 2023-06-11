import type { AbiEventParameter, AbiParameter } from '../abi.js'
import type { Join } from '../types.js'
import {
  type FormatAbiParameter,
  formatAbiParameter,
} from './formatAbiParameter.js'

export type FormatAbiParameters<
  TAbiParameters extends readonly (AbiParameter | AbiEventParameter)[],
> = Join<
  {
    [K in keyof TAbiParameters]: FormatAbiParameter<TAbiParameters[K]>
  },
  ', '
>

export function formatAbiParameters<
  const TAbiParameters extends readonly (AbiParameter | AbiEventParameter)[],
>(abiParameters: TAbiParameters): FormatAbiParameters<TAbiParameters> {
  let params = ''
  const length = abiParameters.length
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i]!
    params += formatAbiParameter(abiParameter)
    if (i !== length - 1) params += ', '
  }
  return params as FormatAbiParameters<TAbiParameters>
}
