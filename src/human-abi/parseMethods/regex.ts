import { SafeRegExp } from './safeRegex'

export const fallbackRegex = new SafeRegExp('fallback\\(\\)')

export const receiveRegex = new SafeRegExp('receive\\(\\) external payable')

export const constructorRegex = new SafeRegExp(
  'constructor\\((?<parameters>.+)\\)',
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
