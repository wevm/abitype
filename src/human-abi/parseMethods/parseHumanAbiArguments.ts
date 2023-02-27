import type { AbiParameter } from '../../abi'
import type { AbiArgs, AbiArgsWithTuple, AbiTypes } from '../utils'
import {
  isTuple,
  parametersWithTupleRegex,
  parametersWithoutTupleRegex,
} from './regex'
import { parseParameters } from './utils'

type Context = {
  structs?: Record<string, AbiArgs[]>
  parseContext: AbiTypes
}
// export function parseHumanAbiArgument<
//   TParameter extends AbiArgsWithTuple,
//   TContext extends Context,
// >(parameter: TParameter, context: TContext): AbiParameter {
//   const isTupleParameter = isTuple.test(parameter)

//   const extracted = isTupleParameter
//     ? parametersWithTupleRegex.exec(parameter)
//     : parametersWithoutTupleRegex.exec(parameter)

//   if (!extracted) {
//     throw new Error(`Error: Failed to parse given parameter '${parameter}'`)
//   }

//   const { type, array, modifier, name } = extracted.groups

//   if (
//     context.parseContext === 'event' &&
//     modifier in ['calldata', 'memory', 'storage']
//   ) {
//     throw new Error(
//       `Error: Modifier '${modifier}' not allowed in '${context.parseContext}' context`,
//     )
//   }

//   if (
//     (context.parseContext === 'error' || context.parseContext === 'function') &&
//     modifier === 'indexed'
//   ) {
//     throw new Error(
//       `Error: Modifier '${modifier}' not allowed in ${context.parseContext} context`,
//     )
//   }

//   const indexed = modifier === 'indexed' ? { indexed: true } : {}

//   const tupleType = 'tuple'
//   let components = {}

//   if (isTupleParameter) {
//     const tupleParams = parseParameters(type)
//     const componentsArray = []

//     for (let i = 0; i < tupleParams.length; i++) {
//       componentsArray.push(
//         parseHumanAbiArgument(tupleParams[i] as AbiArgsWithTuple, context),
//       )
//     }

//     components = { components: componentsArray }
//   }

//   return {
//     name: name ?? '',
//     type: isTupleParameter
//       ? `${tupleType}${array ?? ''}`
//       : `${type}${array ?? ''}`,
//     ...indexed,
//     ...components,
//   }
// }

export function parseHumanAbiArguments<
  TParameters extends AbiArgsWithTuple[],
  TContext extends Context,
>(parameters: TParameters, context: TContext): AbiParameter[] {
  const result: AbiParameter[] = []

  if (parameters[0] === '' || parameters[0] === 'void') {
    return result
  }

  const struct = context.structs ?? {}
  for (let i = 0; i < parameters.length; i++) {
    const remappedParam = parameters[i] as AbiArgsWithTuple

    const isTupleParameter = isTuple.test(remappedParam)

    const extracted = isTupleParameter
      ? parametersWithTupleRegex.exec(remappedParam)
      : parametersWithoutTupleRegex.exec(remappedParam)

    if (!extracted) {
      throw new Error(`Error: Invalid parameter found '${remappedParam}'`)
    }

    const { type, array, modifier, name } = extracted.groups

    if (
      context.parseContext === 'event' &&
      modifier in ['calldata', 'memory', 'storage']
    ) {
      throw new Error(
        `Error: Modifier '${modifier}' not allowed in '${context.parseContext}' context`,
      )
    }

    if (context.parseContext === 'function' && modifier === 'indexed') {
      throw new Error(
        `Error: Modifier '${modifier}' not allowed in ${context.parseContext} context`,
      )
    }

    if (context.parseContext === 'error' && modifier) {
      throw new Error(
        `Error: Modifier '${modifier}' not allowed in ${context.parseContext} context`,
      )
    }

    const indexed = modifier === 'indexed' ? { indexed: true } : {}

    if (isTupleParameter) {
      result.push({
        internalType: `struct${name ?? ''}${array ?? ''}`,
        name: name ?? '',
        type: `tuple${array ?? ''}`,
        ...indexed,
        components: parseHumanAbiArguments(
          parseParameters(type.trim()),
          context,
        ),
      })
    } else if (struct[type]) {
      result.push({
        internalType: `struct${type}${array ?? ''}`,
        name: name ?? '',
        type: `tuple${array ?? ''}`,
        ...indexed,
        components: parseHumanAbiArguments(struct[type] as AbiArgs[], context),
      })
    } else {
      result.push({
        internalType: type,
        name: name ?? '',
        type: type,
        ...indexed,
      })
    }
  }

  return result as AbiParameter[]
}
