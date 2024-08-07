
/**
 * Throws an error if the `condition` in the first argument is `false`.
 * This function is useful to make assumptions explicit. NOT JUST IN TEST CODE.
 *
 * For example consider:
 *
 *     document.body.innerHTML = '<div id="foo"></div>'
 *     const foo : HTMLElement | null = document.getElementById('foo')
 *
 * The type of variable `foo` includes `null` but from the context we know
 * that it can actually never be `null`. We can access attributes of `foo` with
 *
 *     foo?.children
 *
 * but if the assumption is actually broken, we get a silent error.
 * In contrast, with
 *
 *     assert(foo !== null, 'Element cant be found although it was just created')
 *     foo.children // no type error!
 *
 * We make the assumption explicit and force a laud error. Also, after the assertion
 * the type-checker can infer that `foo` is never `null` so we don't get a type
 * error when accessing `foo.children`.
 *
 * Additionally, assertions help static analysis tools like SonarQube reason about
 * the code.
 */
export function assert(condition : boolean, failureMessage? : string): asserts condition {
  if (condition === false) {
    const err = new Error(failureMessage ?? 'assertion failure')
    // Preferably omit the `assert` call itself from the stack trace,
    // so the printed error shows the call site of `assert` instead of the throw site.
    Error.captureStackTrace?.(err, assert)
    throw err
  }
}

/**
 * Raises a type error if the argument is not of type `never`. This is useful to ensure that
 * case analysis is exhaustive. For example consider the type:
 *
 *     type Tshirt = { size: 'S' | 'M' | 'L' }
 *
 * And somewhere we have a case analysis like this:
 *
 *     if (tshift.size === 'S') {
 *       ...
 *     } else if (tshift.size === 'M') {
 *       ...
 *     } else if (tshirt.size === 'L') {
 *       ...
 *     } else {
 *       assertNever(tshirt.size)
 *     }
 *
 * The else-branch is technically unreachable, since all options for "size" have been checked.
 * But if we later add the size "XL", then `assertNever` becomes reachable and raises a type error,
 * which is a reminder to complete the case analysis.
 *
 * This function is pure type trickery. It should be impossible to actually call it and during builds it should
 * be detected as dead code. Only in malicious situations the function body can be executed. For example
 * if code is pushed to production despite type errors. Or if the argument is unsafely converted to never:
 *
 *     assertNever("obviously not never" as never)
 *
 */
export function assertNever(_witness: never): never {
  throw new Error('If you see this error you did something very naughty')
}

/**
 * Type-safe version of the "as" operator:
 *
 *     as<string>(value)     vs.    value as string
 *
 * In TypeScript, "as" both converts to super- and subtypes.
 * Converting to super-types is always safe:
 *
 *     function(foo: string) {
 *       const bar = foo as string | number // safe conversion to super type
 *     }
 *
 * However, converting to subtypes can be dangerous. For example:
 *
 *     function(foo: string | number) {
 *       const bar = (foo as string).length
 *     }
 *
 * raises a runtime error if `foo` is actually a number. Often it's unclear what is super-
 * and what is subtype. This function will only perform safe supertype conversions and otherwise
 * raises a type error:
 *
 *     function(foo: string | number) {
 *       const bar = as<string>(foo).length // raises type-error
 *     }
 *
 * It's recommended to avoid the "as" operator entirely. In situations where subtype conversion is
 * necessary, use `assert`:
 *
 *     function(value: string | number) {
 *       assert(typeof value === 'string', 'expect value to always be string because ...')
 *       const bar = value.length
 *     }
 */
export function as<T>(value: T): T {
  return value
}

/**
 * Same as `Array.prototype.includes` but with extra type guarantees.
 *
 * This is useful to test inclusion against enum-like fixed arrays.
 * For example, consider a fixed array of T-shirt sizes:
 *
 *     const tshirtSizes = ['S', 'M', 'L', 'XL'] as const
 *
 *     type TShirtSize = typeof tshirtSizes  // === readonly ['S', 'M', 'L', 'XL']
 *
 * Somewhere else in the code we want to check whether a `string` is a member
 * of `tshirtSizes`. We could use `Array.prototype.includes` but that does not give
 * any type guarantees:
 *
 *     const size: string = 'XL'
 *
 *     if (tshirtSizes.includes(size)) {
 *         // inferred type of `size` is still `string`
 *     }
 *
 * With `isOneOf` on the other hand, TypeScript can narrow the type `size` down to
 * `TShirtSize`:
 *
 *     if (isOneOf(size, tshirtSizes)) {
 *         // inferred type of `size` is now `TShirtSize`
 *     }
 *
 */
export function isOneOf<
  GeneralValue, // e.g. `string`
  AllowedValues extends readonly GeneralValue[], // e.g. `readonly ['S', 'M', 'L', 'XL']`
>(value: GeneralValue, array: AllowedValues): value is AllowedValues[number] {
  return array.includes(value)
}
