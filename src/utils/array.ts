import { assert } from "./assert"

export type NonEmptyArray<T> = [T, ...T[]] | [...T[], T]

export function isNonEmpty<T>(array: T[]): array is NonEmptyArray<T> {
  return array.length > 0
}

export function asNonEmpty<T>(array: T[]): NonEmptyArray<T> {
  assert(isNonEmpty(array), 'got empty array where non-empty is expected')
  return array
}
