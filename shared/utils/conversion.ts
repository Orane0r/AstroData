import type { ScientificNotation } from '../types/math'

/**
 * Converts a Kelvin temperature in Celsius.
 * @param tempKelvin Temperature in Kelvin.
 * @returns Temperature in Celsius.
 */
export function kelvinToCelsius(tempKelvin: number): number {
  return tempKelvin - 273.15
}

export function valueToScientific(number: number): ScientificNotation {
  if (number === 0) {
    return {
      value: 0,
      exponent: 0
    }
  }

  const exponent = Math.floor(Math.log10(Math.abs(number)))
  const value = number / 10 ** exponent

  return {
    value: value,
    exponent: exponent
  }
}

export function scientificToValue(scientific: ScientificNotation): number {
  return scientific.value * 10 ** scientific.exponent
}
