
/**
 * Removes `prefix` from the beginning of `str` and returns the remaining string.
 * Returns `undefined` if `str` does not start with `prefix`. For example:
 *
 *     stripPrefix("foo", "foobar") === "bar"
 *
 *     stripPrefix("", "foobar") === "foobar"
 *
 *     stripPrefix("baz", "foobar") === undefined
 *
 */
export function stripPrefix(prefix: string, str: string): string | undefined {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length)
  } else {
    return undefined
  }
}

/**
 * Removes `suffix` from the end of `str` and returns the remaining string.
 * Returns `undefined` if `str` does not end with `suffix`. For example:
 *
 *    stripSuffix("bar", "foobar") === "foo"
 *
 *    stripSuffix("", "foobar") === "foobar"
 *
 *    stripSuffix("baz", "foobar") === undefined
 *
 */
export function stripSuffix(suffix: string, str: string): string | undefined {
  if (str.endsWith(suffix)) {
    return str.slice(0, str.length - suffix.length)
  } else {
    return undefined
  }
}
