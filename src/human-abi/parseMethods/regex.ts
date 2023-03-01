import { SafeRegExp } from './safeRegex'

export const fallbackRegex = new SafeRegExp('fallback\\(\\)')

export const receiveRegex = new SafeRegExp('receive\\(\\) external payable')

export const constructorRegex = new SafeRegExp(
  '^constructor\\((?<parameters>.*?)\\)?(?<mutability>payable{1})?$',
  'i',
)

export const parametersWithoutTupleRegex = new SafeRegExp(
  '^(?<type>[a-zA-Z0-9_]+?)(?<array>(?:\\[\\d*?\\])+?)?(?:\\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\\s(?<name>[a-zA-Z0-9_]+))?$',
  'i',
)

export const parametersWithTupleRegex = new SafeRegExp(
  '^\\((?<type>.+?)\\)(?<array>(?:\\[\\d*?\\])+?)?(?:\\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\\s(?<name>[a-zA-Z0-9_]+))?$',
  'i',
)

export const isTuple = new SafeRegExp('^\\(.+?\\).*?$', 'i')

export const structRegex = new SafeRegExp(
  '^[sS]truct\\s(?<name>[a-zA-Z0-9_]+)\\s{(?<parameters>.*?)}$',
  'i',
)

export const errorRegex = new SafeRegExp(
  '^error\\s(?<name>[a-zA-Z0-9_]+)\\((?<parameters>.*?)\\)$',
  'i',
)

export const eventRegex = new SafeRegExp(
  '^event\\s(?<name>[a-zA-Z0-9_]+)\\((?<parameters>.*?)\\)$',
  'i',
)

export const functionRegex = new SafeRegExp(
  '^function\\s(?<name>[a-zA-Z0-9_]+)\\((?<parameters>.*?)\\)(?:\\s(external|public{1}))?(?:\\s(?<mutability>view|pure|payable{1}))?(?:\\sreturns\\s\\((?<returnParameters>.*?)\\))?$',
  'i',
)
