import fc from 'fast-check'
import { it, test, describe, expect } from 'vitest'
import { adjacentPairs, extractAt, removeAt } from './array'
import { assert } from './assert'

describe('extractAt', () => {

  it('can extract item with non-negative, in-bound index', () => {
    fc.assert(fc.property(
      fc.array(fc.nat()),
      fc.nat(),
      fc.array(fc.nat()),
      (prefix, item, suffix) => {
        const array = [...prefix, item, ...suffix]
        const nonNegativeIndex = prefix.length

        const result = extractAt(nonNegativeIndex, array)
        assert(result !== undefined, 'index should be in-bound by construction')
        const [extractedItem, arrayWithoutItem] = result

        expect(extractedItem).toEqual(item)
        expect(arrayWithoutItem).toEqual([...prefix, ...suffix])
      },
    ))
  })

  it('can extract item with negative, in-bound index', () => {
    fc.assert(fc.property(
      fc.array(fc.nat()),
      fc.nat(),
      fc.array(fc.nat()),
      (prefix, item, suffix) => {
        const array = [...prefix, item, ...suffix]
        const negativeIndex = -suffix.length - 1

        const result = extractAt(negativeIndex, array)
        assert(result !== undefined, 'index should be in-bound by construction')
        const [extractedItem, arrayWithoutItem] = result

        expect(extractedItem).toEqual(item)
        expect(arrayWithoutItem).toEqual([...prefix, ...suffix])
      },
    ))
  })

  it('returns `undefined` if index is out-of-bounds', () => {
    fc.assert(fc.property(
      fc.integer(),
      fc.array(fc.nat()),
      (index, array) => {
        fc.pre(index < -array.length || index >= array.length)
        expect(extractAt(index, array)).toBeUndefined()
      },
    ))
  })

})

describe('removeAt', () => {

  it('can remove array item at non-negative in-bound index', () => {
    fc.assert(fc.property(
      fc.array(fc.nat()),
      fc.nat(),
      fc.array(fc.nat()),
      (arrayBefore, removedItem, arrayAfter) => {
        const array = [...arrayBefore, removedItem, ...arrayAfter]
        const rest = removeAt(arrayBefore.length, array)
        expect(rest).toEqual([...arrayBefore, ...arrayAfter])
      },
    ))
  })

  it('returns original array if index is out-of-bounds', () => {
    fc.assert(fc.property(
      fc.integer(),
      fc.array(fc.nat()),
      (index, array) => {
        fc.pre(index < -array.length || index > array.length)
        // referencial equality should be sufficient
        expect(removeAt(index, array)).toBe(array)
      },
    ))
  })

})

describe('adjacentPairs', () => {

  test('adjacentPairs([1,2,3]) returns [[1,2], [2,3]]', () => {
    expect(adjacentPairs([1, 2, 3])).toEqual([[1, 2], [2, 3]])
  })

})
