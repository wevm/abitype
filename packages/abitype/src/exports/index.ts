import type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiEventParameter,
  AbiFallback,
  AbiFunction,
  AbiInternalType,
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
  AbiReceive,
  AbiStateMutability,
  AbiType,
  Address,
  SolidityAddress,
  SolidityArray,
  SolidityArrayWithTuple,
  SolidityArrayWithoutTuple,
  SolidityBool,
  SolidityBytes,
  SolidityFixedArrayRange,
  SolidityFixedArraySizeLookup,
  SolidityFunction,
  SolidityInt,
  SolidityString,
  SolidityTuple,
  TypedData,
  TypedDataDomain,
  TypedDataParameter,
  TypedDataType,
} from '../abi.js'
import type {
  DefaultRegister,
  Register,
  ResolvedRegister,
} from '../register.js'
import type {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiTypeToPrimitiveType,
  ExtractAbiError,
  ExtractAbiErrorNames,
  ExtractAbiErrors,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractAbiFunctions,
  IsAbi,
  IsTypedData,
  TypedDataToPrimitiveTypes,
} from '../utils.js'

export type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiEventParameter,
  AbiFallback,
  AbiFunction,
  AbiInternalType,
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
  AbiReceive,
  AbiStateMutability,
  AbiType,
  Address,
  SolidityAddress,
  SolidityArray,
  SolidityArrayWithoutTuple,
  SolidityArrayWithTuple,
  SolidityBool,
  SolidityBytes,
  SolidityFixedArrayRange,
  SolidityFixedArraySizeLookup,
  SolidityFunction,
  SolidityInt,
  SolidityString,
  SolidityTuple,
  TypedData,
  TypedDataDomain,
  TypedDataParameter,
  TypedDataType,
} from '../abi.js'

// biome-ignore lint/performance/noBarrelFile: <explanation>
export { BaseError } from '../errors.js'

export type { Narrow } from '../narrow.js'
export { narrow } from '../narrow.js'

export type {
  Register,
  DefaultRegister,
  ResolvedRegister,
} from '../register.js'

export type {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiTypeToPrimitiveType,
  ExtractAbiError,
  ExtractAbiErrorNames,
  ExtractAbiErrors,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractAbiFunctions,
  IsAbi,
  IsTypedData,
  TypedDataToPrimitiveTypes,
} from '../utils.js'

////////////////////////////////////////////////////////////////////////////////////////////////////
// Namespace Types

export interface abi extends Abi {}

export declare namespace abi {
  type item = abi[number]
  type itemType = AbiItemType
  type address = Address
  type stateMutability = AbiStateMutability
  type valid<abi_> = IsAbi<abi_>

  namespace types {
    export type item = AbiType
    export type internal = AbiInternalType
    export type address = SolidityAddress
    export type bool = SolidityBool
    export type bytes = SolidityBytes
    export type { SolidityFunction as function }
    export type { SolidityString as string }
    export type tuple = SolidityTuple
    export type int = SolidityInt
    export type array = SolidityArray
    export type arrayWithoutTuple = SolidityArrayWithoutTuple
    export type arrayWithTuple = SolidityArrayWithTuple
    export type fixedArrayRange = SolidityFixedArrayRange
    export type fixedArraySizeLookup = SolidityFixedArraySizeLookup
    export type infer<
      abiType extends abi.types.item,
      abiParameterKind extends abi.parameter.kind = abi.parameter.kind,
    > = AbiTypeToPrimitiveType<abiType, abiParameterKind>
  }

  namespace parameter {
    type item = AbiParameter
    type event = AbiEventParameter
    type kind = AbiParameterKind
    type infer<
      abiParameter extends abi.parameter.item | { name: string; type: unknown },
      abiParameterKind extends abi.parameter.kind = abi.parameter.kind,
    > = AbiParameterToPrimitiveType<abiParameter, abiParameterKind>
  }

  namespace parameters {
    type root = readonly abi.parameter.item[]
    type infer<
      abiParameters extends abi.parameters.root,
      abiParameterKind extends abi.parameter.kind = abi.parameter.kind,
      experimental_namedTuples extends
        boolean = resolvedRegister['experimental_namedTuples'],
    > = AbiParametersToPrimitiveTypes<
      abiParameters,
      abiParameterKind,
      experimental_namedTuples
    >
  }

  namespace functions {
    type item = AbiFunction
    type items<
      abi_ extends abi,
      abiStateMutability extends abi.stateMutability = abi.stateMutability,
    > = ExtractAbiFunctions<abi_, abiStateMutability>
    type names<
      abi_ extends abi,
      abiStateMutability extends abi.stateMutability = abi.stateMutability,
    > = ExtractAbiFunctionNames<abi_, abiStateMutability>
    type extract<
      abi_ extends abi,
      name extends abi.functions.names<abi_, abiStateMutability>,
      abiStateMutability extends abi.stateMutability = abi.stateMutability,
    > = ExtractAbiFunction<abi_, name, abiStateMutability>
  }

  namespace events {
    type item = AbiEvent
    type items<abi_ extends abi> = ExtractAbiEvents<abi_>
    type names<abi_ extends abi> = ExtractAbiEventNames<abi_>
    type extract<
      abi_ extends abi,
      name extends abi.events.names<abi_>,
    > = ExtractAbiEvent<abi_, name>
  }

  namespace errors {
    type item = AbiError
    type items<abi_ extends abi> = ExtractAbiErrors<abi_>
    type names<abi_ extends abi> = ExtractAbiErrorNames<abi_>
    type extract<
      abi_ extends abi,
      name extends abi.errors.names<abi_>,
    > = ExtractAbiError<abi_, name>
  }

  namespace constructors {
    type item = AbiConstructor
  }

  namespace fallback {
    type item = AbiFallback
  }

  namespace receive {
    type item = AbiReceive
  }
}

export declare namespace typedData {
  type root = TypedData
  type domain = TypedDataDomain
  type field = TypedDataParameter
  type fieldType = TypedDataType
  type infer<
    typedData_ extends typedData.root,
    abiParameterKind extends abi.parameter.kind = abi.parameter.kind,
    keyReferences extends { [_: string]: unknown } | unknown = unknown,
  > = TypedDataToPrimitiveTypes<typedData_, abiParameterKind, keyReferences>
  type valid<typedData_> = IsTypedData<typedData_>
}

export declare namespace a {
  type abi = Abi

  namespace abi {
    type item = a.abi[number]
    type itemType = AbiItemType
    type address = Address
    type stateMutability = AbiStateMutability
    type valid<abi_> = IsAbi<abi_>

    namespace types {
      export type item = AbiType
      export type internal = AbiInternalType
      export type address = SolidityAddress
      export type bool = SolidityBool
      export type bytes = SolidityBytes
      export type { SolidityFunction as function }
      export type { SolidityString as string }
      export type tuple = SolidityTuple
      export type int = SolidityInt
      export type array = SolidityArray
      export type arrayWithoutTuple = SolidityArrayWithoutTuple
      export type arrayWithTuple = SolidityArrayWithTuple
      export type fixedArrayRange = SolidityFixedArrayRange
      export type fixedArraySizeLookup = SolidityFixedArraySizeLookup
      export type infer<
        abiType extends a.abi.types.item,
        abiParameterKind extends a.abi.parameter.kind = a.abi.parameter.kind,
      > = AbiTypeToPrimitiveType<abiType, abiParameterKind>
    }

    namespace parameter {
      type item = AbiParameter
      type event = AbiEventParameter
      type kind = AbiParameterKind
      type infer<
        abiParameter extends
          | a.abi.parameter.item
          | {
              name: string
              type: unknown
            },
        abiParameterKind extends a.abi.parameter.kind = a.abi.parameter.kind,
      > = AbiParameterToPrimitiveType<abiParameter, abiParameterKind>
    }

    namespace parameters {
      type root = readonly a.abi.parameter.item[]
      type infer<
        abiParameters extends a.abi.parameters.root,
        abiParameterKind extends a.abi.parameter.kind = a.abi.parameter.kind,
        experimental_namedTuples extends
          boolean = ResolvedRegister['experimental_namedTuples'],
      > = AbiParametersToPrimitiveTypes<
        abiParameters,
        abiParameterKind,
        experimental_namedTuples
      >
    }

    namespace functions {
      type item = AbiFunction
      type items<
        abi_ extends a.abi,
        abiStateMutability extends
          a.abi.stateMutability = a.abi.stateMutability,
      > = ExtractAbiFunctions<abi_, abiStateMutability>
      type names<
        abi_ extends a.abi,
        abiStateMutability extends
          a.abi.stateMutability = a.abi.stateMutability,
      > = ExtractAbiFunctionNames<abi_, abiStateMutability>
      type extract<
        abi_ extends a.abi,
        name extends a.abi.functions.names<abi_, abiStateMutability>,
        abiStateMutability extends
          a.abi.stateMutability = a.abi.stateMutability,
      > = ExtractAbiFunction<abi_, name, abiStateMutability>
    }

    namespace events {
      type item = AbiEvent
      type items<abi_ extends a.abi> = ExtractAbiEvents<abi_>
      type names<abi_ extends a.abi> = ExtractAbiEventNames<abi_>
      type extract<
        abi_ extends a.abi,
        name extends a.abi.events.names<abi_>,
      > = ExtractAbiEvent<abi_, name>
    }

    namespace errors {
      type item = AbiError
      type items<abi_ extends a.abi> = ExtractAbiErrors<abi_>
      type names<abi_ extends a.abi> = ExtractAbiErrorNames<abi_>
      type extract<
        abi_ extends a.abi,
        name extends a.abi.errors.names<abi_>,
      > = ExtractAbiError<abi_, name>
    }

    namespace constructors {
      type item = AbiConstructor
    }

    namespace fallback {
      type item = AbiFallback
    }

    namespace receive {
      type item = AbiReceive
    }
  }

  namespace typedData {
    type root = TypedData
    type domain = TypedDataDomain
    type field = TypedDataParameter
    type fieldType = TypedDataType
    type infer<
      typedData_ extends a.typedData.root,
      abiParameterKind extends a.abi.parameter.kind = a.abi.parameter.kind,
      keyReferences extends { [_: string]: unknown } | unknown = unknown,
    > = TypedDataToPrimitiveTypes<typedData_, abiParameterKind, keyReferences>
    type valid<typedData_> = IsTypedData<typedData_>
  }

  type register = Register
  type resolvedRegister = ResolvedRegister
  type defaultRegister = DefaultRegister
}

export type register = Register
export type resolvedRegister = ResolvedRegister
export type defaultRegister = DefaultRegister

////////////////////////////////////////////////////////////////////////////////////////////////////
// Human-Readable

export {
  formatAbi,
  type FormatAbi,
} from '../human-readable/formatAbi.js'

export {
  formatAbiItem,
  type FormatAbiItem,
} from '../human-readable/formatAbiItem.js'

export {
  formatAbiParameter,
  type FormatAbiParameter,
} from '../human-readable/formatAbiParameter.js'

export {
  formatAbiParameters,
  type FormatAbiParameters,
} from '../human-readable/formatAbiParameters.js'

export { parseAbi, type ParseAbi } from '../human-readable/parseAbi.js'

export {
  parseAbiItem,
  type ParseAbiItem,
} from '../human-readable/parseAbiItem.js'

export {
  parseAbiParameter,
  type ParseAbiParameter,
} from '../human-readable/parseAbiParameter.js'

export {
  parseAbiParameters,
  type ParseAbiParameters,
} from '../human-readable/parseAbiParameters.js'

export {
  UnknownTypeError,
  InvalidAbiItemError,
  UnknownSolidityTypeError,
} from '../human-readable/errors/abiItem.js'

export {
  InvalidAbiTypeParameterError,
  InvalidFunctionModifierError,
  InvalidModifierError,
  SolidityProtectedKeywordError,
  InvalidParameterError,
  InvalidAbiParametersError,
  InvalidAbiParameterError,
} from '../human-readable/errors/abiParameter.js'

export {
  InvalidStructSignatureError,
  InvalidSignatureError,
  UnknownSignatureError,
} from '../human-readable/errors/signature.js'

export { InvalidParenthesisError } from '../human-readable/errors/splitParameters.js'

export { CircularReferenceError } from '../human-readable/errors/struct.js'
