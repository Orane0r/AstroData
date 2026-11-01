/**
 * Scales positive values to 0–100 relative to the largest one (which gets 100),
 * so that metrics with different units can share the same radar axis.
 * @param values Values to scale together (e.g. [body, average]).
 * @param decades If set, uses a log scale where max / 10^decades maps to 0
 * (for values spanning several orders of magnitude, like mass).
 * @returns Scaled values, in the same order. Non-positive values give 0.
 */
export function scaleToMax(values: number[], decades?: number): number[] {
  const max = Math.max(...values)

  return values.map((value) => {
    if (value <= 0 || max <= 0) {
      return 0
    }

    const ratio = value / max
    if (!decades) {
      return ratio * 100
    }

    return Math.max(0, 100 * (1 + Math.log10(ratio) / decades))
  })
}
