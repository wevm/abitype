export type join<
  list extends readonly unknown[],
  separator extends string,
> = list extends readonly [infer head, ...infer tail]
  ? tail['length'] extends 0
    ? `${head & string}`
    : `${head & string}${separator}${join<tail, separator>}`
  : never

export function join<
  const list extends readonly unknown[],
  separator extends string,
>(list: list, separator: separator): join<list, separator> {
  return list.join(separator) as join<list, separator>
}
