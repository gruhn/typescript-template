import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { stripPrefix, stripSuffix } from './string'

describe('stripPrefix', () => {

  it('returns remaining string after removing prefix', () => {
    fc.assert(fc.property(
      fc.string(),
      fc.string(),
      (prefix, suffix) => {
        expect(stripPrefix(prefix, prefix + suffix)).toBe(suffix)
      },
    ))
  })

  it('returns `undefined` for non-matching prefixes', () => {
    fc.assert(fc.property(
      fc.string(),
      fc.string(),
      (invalidPrefix, str) => {
        fc.pre(!str.startsWith(invalidPrefix))
        expect(stripPrefix(invalidPrefix, str)).toBeUndefined()
      },
    ))
  })

})

describe('stripSuffix', () => {

  it('returns remaining string after removing suffix', () => {
    fc.assert(fc.property(
      fc.string(),
      fc.string(),
      (prefix, suffix) => {
        expect(stripSuffix(suffix, prefix + suffix)).toBe(prefix)
      },
    ))
  })

  it('returns `undefined` for non-matching suffixes', () => {
    fc.assert(fc.property(
      fc.string(),
      fc.string(),
      (invalidSuffix, str) => {
        fc.pre(!str.endsWith(invalidSuffix))
        expect(stripSuffix(invalidSuffix, str)).toBeUndefined()
      },
    ))
  })

})
