
/**
 * Counts the number of `true` values in `bools`. For example:
 *
 *     cardinality([true, false, true]) === 2
 */
export function cardinality(bools: boolean[]): number {
  return bools.filter(bool => bool).length
}

