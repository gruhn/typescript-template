import { assert } from './assert'

export type NonEmptyArray<T> =
  | readonly [T, ...T[]]
  | readonly [...T[], T]

/**
 * Just returns the first array item. For `NonEmptyArray` this is always safe, because
 * in a non-empty array *a first item* always exists. The default TypeScript behavior is
 * slightly dangerous. Consider:
 *
 *     const array: number[] = [1,2,3]
 *     array[0]
 *
 * The inferred type of `array[0]` is `number` but it should actually just `number | undefined`,
 * because `array` might be empty. Thus, the following code will cause a runtime error without
 * a warning from TypeScript:
 *
 *     const array: string[] = []
 *     array[0].length
 *
 */
export function first<T>(array: NonEmptyArray<T>): T {
  return array[0]
}

/**
 * Just returns the last array item. For `NonEmptyArray` this is always safe, because
 * in a non-empty array *a last item* always exists. The default TypeScript behavior is
 * slightly dangerous. Consider:
 *
 *     const array: number[] = [1,2,3]
 *     array[array.length-1]
 *
 * The inferred type of `array[array.length-1]` is `number` but it should actually just `number | undefined`,
 * because `array` might be empty. Thus, the following code will cause a runtime error without
 * a warning from TypeScript:
 *
 *     const array: string[] = []
 *     array[array.length-1].length
 *
 */
export function last<T>(array: NonEmptyArray<T>): T {
  return array[array.length - 1]
}

/**
 * Decompose `array` into its last item and all items before that, without mutating the
 * original array. Intuitively what this (invalid) syntax would do:
 *
 *     const [ ...initial, last ] = array
 *
 * The function is only defined for non empty arrays. Verify first that the array is non empty
 * using `isNonEmpty`.
 */
export function extractLast<T>(array: NonEmptyArray<T>): [T[], T] {
  return [array.slice(0, -1), last(array)]
}

/**
 * Decompose `array` into its first item and all items after that, without mutating the
 * original array. This is a type-safe version of this operation:
 *
 *     const [ first, ...rest ] = array
 *
 * When using the above syntax, `first` might be undefined when `array` is empty but TypeScript
 * does not annotate the type of `first` with undefined. In contrast, `extractFirst` can only
 * be called with `NonEmptyArray`.
 */
export function extractFirst<T>(array: NonEmptyArray<T>): [T, T[]] {
  return [first(array), array.slice(1)]
}

/**
 * Decompose `array` into the item at index `index` and the remaining items, without
 * mutating `array`. Negative indices start from the end. Returns `undefined` if
 * `index` is out-of-bounds:
 *
 *     extractAt(1, [0,1,2]) === [1,[0,2]]
 *
 *     extractAt(-1, [0,1,2]) === [2,[0,1]]
 *
 *     extractAt(3, [0,1,2]) === undefined
 *
 *     extractAt(-3, [0,1,2]) === undefined
 *
 */
export function extractAt<T>(index: number, array: readonly T[]): [T, T[]] | undefined {
  assert(Number.isInteger(index), `expected integer valued index, got ${index}`)
  const item = array.at(index)
  if (item === undefined) {
    return undefined
  } else {
    const prefix = array.slice(0, index)
    const [_, ...suffix] = array.slice(index)
    return [item, [...prefix, ...suffix]]
  }
}

/**
 * Remove item at `index` from `array` without mutating the original array.
 * Returns the remaining items. Negative indices start from the end.
 * If `index` is out-of-bounds, the original array is returned:
 *
 *     removeAt(1, [0,1,2]) === [0,2]
 *
 *     removeAt(-1, [0,1,2]) === [0,1]
 *
 *     removeAt(3, [0,1,2]) === [0,1,2]
 *
 *     removeAt(-3, [0,1,2]) === [0,1,2]
 *
 */
export function removeAt<T>(index: number, array: readonly T[]): readonly T[] {
  const decomposed = extractAt(index, array)
  if (decomposed === undefined) {
    return array
  } else {
    const [_, restArray] = decomposed
    return restArray
  }
}

/**
 * Concatenating NonEmptyArray's always yields a NonEmptyArray. Standard ways of concatenating arrays like:
 *
 *     [ ...arrayA, ...arrayB ]
 *     arrayA.concat(arrayB)
 *
 * return a normal array, so the type guarantee is lost.
 */
export function concat<T>(arrayA: NonEmptyArray<T>, arrayB: readonly T[]): NonEmptyArray<T>
export function concat<T>(arrayA: readonly T[], arrayB: NonEmptyArray<T>): NonEmptyArray<T>
export function concat<T>(arrayA: readonly T[], arrayB: readonly T[]): NonEmptyArray<T> {
  return asNonEmpty(arrayA.concat(arrayB))
}

/**
 * Type guard to check whether `array` has at least one element. The advantage:
 *
 *     if (array.length > 0) {
 *       // type error: Typescript does not understand that `array` is non empty
 *       extractLast(array)
 *     }
 *
 *     if (isNonEmpty(array)) {
 *       // ok: Typescript can infer that `array` is non empty
 *       extractLast(array)
 *     }
 *
 */
export function isNonEmpty<T>(array: readonly T[]): array is NonEmptyArray<T> {
  return array.length > 0
}

/**
 * Just checks whether `array.length === 0` but with type guarantee that `array`
 * has type `[]`.
 */
export function isEmpty(array: unknown[]): array is [] {
  return array.length === 0
}

/**
 * Merely returns the argument `array` but with the type guarantee that `array` is
 * non empty. Throws an error if `array` is actually empty. This function is useful
 * when it's clear from the context that `array` is definitively non-empty but
 * TypeScript is not able to infer it. For example, for these arrays like:
 *
 *     [ item, ...array2 ]
 *
 *     [ ...array1, item ]
 *
 * The type `NonEmptyArray` is infered. But for this array:
 *
 *     [ ...array1, item, ...array2 ]
 *
 * it's not infered, although the array is obviously non-empty.
 */
export function asNonEmpty<T>(array: readonly T[]): NonEmptyArray<T> {
  assert(isNonEmpty(array), 'got empty array where at least one element is required')
  return array
}

/**
 * Like lodash/zip but if one array is longer than the other,
 * additional elements are dropped, which avoids `undefined` values
 * in the return type. For example:
 *
 *     zip([1,2,3], ['a','b']) === [[1,'a'], [2,'b']]
 */
export function zip<T, U>(array1: readonly T[], array2: readonly U[]): [T, U][] {
  if (array1.length <= array2.length) {
    return array1.map((left, index) => [left, array2[index]])
  } else {
    return array2.map((right, index) => [array1[index], right])
  }
}

/**
 * Pairs each array item with it's right neighbor. For example:
 *
 *     adjacentPairs([1,2,3]) === [[1,2], [2,3]]
 *
 */
export function adjacentPairs<T>(array: readonly T[]): [T, T][] {
  return zip(array.slice(0, -1), array.slice(1))
}

/**
 * 
 *   MinArray<T, 1> === [T, ...T[]] | [...T[], T]
 *   MinArray<T, 2> === [T, T, ...T[]] | [...T[], T, T]
 *   MinArray<T, 3> === [T, T, T, ...T[]] | [...T[], T, T, T]
 * 
 */
type MinArray<Item, MinLength extends number> = _MinArray<Item, MinLength, []>

type _MinArray<
  Item, 
  MinLength extends number, 
  MinItems extends Item[]
> = 
  MinItems['length'] extends MinLength 
    ? [...MinItems, ...Item[]] | [...Item[], ...MinItems]
    : _MinArray<Item, MinLength, [Item, ...MinItems]>

function hasMinLength<T, const N extends number>(array: T[], minLength: N): array is MinArray<T,N> {
  return array.length >= minLength
}

function test<T>(array: Array<T>) {
  if (hasMinLength(array, 10)) {
    array[8] satisfies T
  }
}

