import type { AbiParameter } from '../../abi'
import type { AbiArgsWithTuple, AbiTypes } from '../utils'
import {
  isTuple,
  parametersWithTupleRegex,
  parametersWithoutTupleRegex,
} from './regex'
import { parseParameters } from './utils'

export type Context = {
  structs?: Record<string, AbiArgsWithTuple[]>
  parseContext: AbiTypes
  structTypes: WeakSet<{ structType: string }>
}

export function parseHumanAbiArgument<
  TParameter extends AbiArgsWithTuple,
  TContext extends Context,
>(parameter: TParameter, context: TContext): AbiParameter {
  const isTupleParameter = isTuple.test(parameter)

  const extracted = isTupleParameter
    ? parametersWithTupleRegex.exec(parameter)
    : parametersWithoutTupleRegex.exec(parameter)

  if (!extracted) {
    throw new Error(`Error: Failed to parse given parameter '${parameter}'`)
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

  if (
    (context.parseContext === 'error' || context.parseContext === 'function') &&
    modifier === 'indexed'
  ) {
    throw new Error(
      `Error: Modifier '${modifier}' not allowed in ${context.parseContext} context`,
    )
  }

  const indexed = modifier === 'indexed' ? { indexed: true } : {}

  const tupleType = 'tuple'
  let components = {}
  const structs = context.structs ?? {}

  if (isTupleParameter) {
    const tupleParams = parseParameters(type)
    const componentsArray = []

    for (let i = 0; i < tupleParams.length; i++) {
      componentsArray.push(
        parseHumanAbiArgument(
          tupleParams[i]?.trim() as AbiArgsWithTuple,
          context,
        ),
      )
    }

    components = { components: componentsArray }
  } else if (structs[type]) {
    if (context.structTypes.has({ structType: type })) {
      throw new Error(`Error: Circular reference on struct type '${type}'`)
    }

    const componentsArray = []

    context.structTypes.add({ structType: type })

    for (let i = 0; i < (structs[type] as AbiArgsWithTuple[]).length; i++) {
      componentsArray.push(
        parseHumanAbiArgument(
          (structs[type] as AbiArgsWithTuple[])[i] as AbiArgsWithTuple,
          context,
        ),
      )
    }

    components = { components: componentsArray }
  }

  return {
    internalType: isTupleParameter
      ? `struct${name ?? ''}${array ?? ''}`
      : `${type}${array ?? ''}`,
    name: name ?? '',
    type: isTupleParameter
      ? `${tupleType}${array ?? ''}`
      : `${type}${array ?? ''}`,
    ...indexed,
    ...components,
  }
}

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
      if (context.structTypes.has({ structType: type })) {
        throw new Error(`Error: Circular reference on struct type '${type}'`)
      }
      context.structTypes.add({ structType: type })

      result.push({
        internalType: `struct${type}${array ?? ''}`,
        name: name ?? '',
        type: `tuple${array ?? ''}`,
        ...indexed,
        components: parseHumanAbiArguments(
          struct[type] as AbiArgsWithTuple[],
          context,
        ),
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

export function parseTuple<
  TTuple extends AbiArgsWithTuple,
  TContext extends Context,
>(parameter: TTuple, context: TContext) {
  const extracted = parametersWithTupleRegex.exec(parameter)

  if (context.structs !== undefined) {
    throw new Error(
      "Error: Cannot parse structs in this function call. Please use 'parseHumanAbiArgument' or 'parseHumanAbiArguments' instead",
    )
  }

  if (!extracted) {
    throw new Error(`Error: Failed to parse given parameter '${parameter}'`)
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

  if (
    (context.parseContext === 'error' || context.parseContext === 'function') &&
    modifier === 'indexed'
  ) {
    throw new Error(
      `Error: Modifier '${modifier}' not allowed in ${context.parseContext} context`,
    )
  }

  const tupleType = 'tuple'
  const indexed = modifier === 'indexed' ? { indexed: true } : {}
  let components = {}

  const tupleParams = parseParameters(type)
  const componentsArray = []

  for (let i = 0; i < tupleParams.length; i++) {
    componentsArray.push(
      parseTuple(tupleParams[i]?.trim() as AbiArgsWithTuple, context),
    )
  }

  components = { components: componentsArray }

  return {
    internalType: `struct${name ?? ''}${array ?? ''}`,
    name: name ?? '',
    type: `${tupleType}${array ?? ''}`,
    ...indexed,
    ...components,
  }
}
