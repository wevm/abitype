import type { AbiStateMutability } from '../../abi.js'
import { execTyped } from '../../regex.js'
import type {
  EventModifier,
  FunctionModifier,
  Modifier,
} from '../types/index.js'

// https://regexr.com/78tsr
const errorSignatureRegex =
  /^error (?<name>[a-zA-Z0-9_]+)\((?<parameters>.*?)\)$/
export function isErrorSignature(signature: string) {
  return errorSignatureRegex.test(signature)
}
export function execErrorSignature(signature: string) {
  return execTyped<{ name: string; parameters: string }>(
    errorSignatureRegex,
    signature,
  )
}

// https://regexr.com/78tv3
const eventSignatureRegex =
  /^event (?<name>[a-zA-Z0-9_]+)\((?<parameters>.*?)\)$/
export function isEventSignature(signature: string) {
  return eventSignatureRegex.test(signature)
}
export function execEventSignature(signature: string) {
  return execTyped<{ name: string; parameters: string }>(
    eventSignatureRegex,
    signature,
  )
}

// https://regexr.com/78u1b
const functionSignatureRegex =
  /^function (?<name>[a-zA-Z0-9_]+)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/
export function isFunctionSignature(signature: string) {
  return functionSignatureRegex.test(signature)
}
export function execFunctionSignature(signature: string) {
  return execTyped<{
    name: string
    parameters: string
    stateMutability?: AbiStateMutability
    returns?: string
  }>(functionSignatureRegex, signature)
}

// https://regexr.com/78tsu
const structSignatureRegex =
  /^struct (?<name>[a-zA-Z0-9_]+) \{(?<properties>.*?)\}$/
export function isStructSignature(signature: string) {
  return structSignatureRegex.test(signature)
}
export function execStructSignature(signature: string) {
  return execTyped<{ name: string; properties: string }>(
    structSignatureRegex,
    signature,
  )
}

// https://regexr.com/78u01
const constructorSignatureRegex =
  /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/
export function isConstructorSignature(signature: string) {
  return constructorSignatureRegex.test(signature)
}
export function execConstructorSignature(signature: string) {
  return execTyped<{
    parameters: string
    stateMutability?: Extract<AbiStateMutability, 'payable'>
  }>(constructorSignatureRegex, signature)
}

// https://regexr.com/78u18
const fallbackSignatureRegex = /^fallback\(\)$/
export function isFallbackSignature(signature: string) {
  return fallbackSignatureRegex.test(signature)
}

// https://regexr.com/78u1k
const receiveSignatureRegex = /^receive\(\) external payable$/
export function isReceiveSignature(signature: string) {
  return receiveSignatureRegex.test(signature)
}

export const modifiers = new Set<Modifier>([
  'memory',
  'indexed',
  'storage',
  'calldata',
])
export const eventModifiers = new Set<EventModifier>(['indexed'])
export const functionModifiers = new Set<FunctionModifier>([
  'calldata',
  'memory',
  'storage',
])
