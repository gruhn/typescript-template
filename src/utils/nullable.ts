
/**
 * Applies a function to a potentially `null`/`undefined` value. If the value is in fact 
 * `null` or `undefined`, the value is just returned as-is.
 * 
 * This operations is surprisingly inconvenient in vanilla JavaScript, despite all the 
 * syntax sugar around `undefined`. For example, let's say we have some timeout value 
 * given as an environment variable:
 * 
 *     process.env.SOME_TIMEOUT // type: `string | undefined`
 * 
 * We want to parse the string into an integer but if the environment variable is `undefined`
 * we want to give a default value. There are plenty of ways to do it:
 * 
 *     let timeout = DEFAULT_VALUE
 *     if (process.env.SOME_TIMEOUT) {
 *        timeout = parseInt(process.env.SOME_TIMEOUT)
 *     }
 * 
 * Here, we have to use a `let` although this variable should never be reassigned. Another option:
 * 
 *     const timeout = process.env.SOME_TIMEOUT ? parseInt(process.env.SOME_TIMEOUT) : DEFAULT_VALUE
 * 
 * Now we have to mention `process.env.SOME_TIMEOUT` twice. Also, ternary is hard to read.
 * Finally, with `map` it looks like this:
 *
 *     const timeout = map(process.env.SOME_TIMEOUT, parseInt) ?? DEFAULT_VALUE
 *
 */
export function map<A,B>(value: NonNullable<A> | null, func: (_: NonNullable<A>) => B): B | null;
export function map<A,B>(value: NonNullable<A> | undefined, func: (_: NonNullable<A>) => B): B | undefined;
export function map<A,B>(value: NonNullable<A> | null | undefined, func: (_: NonNullable<A>) => B): B | null | undefined {
  if (value === undefined || value === null) {
    return value
  } else {
    value satisfies NonNullable<A>
    return func(value)
  }
}

/**
 * Returns `true` if `value` is neither `undefined` nor `null`. These two are doing the same thing:
 *
 *     if (Nullable.isDefined(value)) { ... }
 *
 *     if (value !== undefined && value !== null) { ... }
 *
 * However, if you have an array of values such as:
 *
 *     const values: (string | undefined)[] = ...
 *
 * then `values.every(value => value !== undefined)` won't narrow the type down to `string[]`.
 * This changes in TypeScript 5.5 but until then `values.every(isDefined)` can do the job instead.
 */
export function isDefined<T>(value: NonNullable<T> | undefined | null): value is NonNullable<T> {
  if (value === undefined || value === null) {
    value satisfies (undefined | null)
    return false
  } else {
    value satisfies NonNullable<T>
    return true
  }
}
