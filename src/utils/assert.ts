/**
 * Throws an error if the `condition` in the first argument is `false`.
 * This function is useful to make assumptions explicit. For example,
 * let's say we have a variable
 *
 *     const value : string | undefined = ...
 *
 * but from the context we know that it can actually never be `undefined`.
 * We can access attributes of `value` with
 *
 *     value?.length
 *
 * but if the assumption is actually broken, we can a silent error.
 * In contrast, with
 *
 *     assert(value !== undefined, 'reason why we assume value always defined')
 *     value.length // no type error
 *
 * We make the assumption explicit and force a laud error. Also the type
 * check can narrow the type of `value` to `string` after the `assert` and we
 * can access properties without type error.
 */
export function assert(condition: boolean, failureMessage?: string): asserts condition {
  if (condition === false) {
    throw new Error(failureMessage ?? 'assertion failure')
  }
}

export function assertNever(_witness: never): never {
  throw new Error('this code should be unreachable')
}

export function as<T>(value: T): T {
  return value
}

export function isOneOf<
  GeneralType,
  ConstOptions extends readonly GeneralType[],
>(value: GeneralType, options: ConstOptions): value is ConstOptions[number] {
  if (options.includes(value)) {
    value satisfies ConstOptions[number]
    return true
  } else {
    return false
  }
}
