/**
 * Transforms a value into an array if it is solo.
 */
export function transformIntoArray(val: unknown): unknown[] | undefined {
  if (val === undefined) return undefined
  return Array.isArray(val) ? val : [val]
}
