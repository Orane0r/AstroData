/**
 * Removes a leading number prefix: "123 Name" or "(123) Name" → "Name".
 */
export function removeNumberPrefix(value: string): string {
  return value.replace(/^(?:\d+|\(\d+\))\s+/, '')
}
