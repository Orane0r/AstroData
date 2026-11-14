/**
 * Removes a leading number prefix: "123 Name" or "(123) Name" → "Name".
 */
export function removeNumberPrefix(value: string): string {
  return value.replace(/^(?:\d+|\(\d+\))\s+/, '')
}

/**
 * Turns a label into a URL slug: lowercase ASCII letters and digits only,
 * everything else collapsed into single dashes.
 * "2867 Šteins" → "2867-steins", "Hiʻiaka" → "hiiaka".
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    // Combining diacritics ("é" → "e", "Š" → "S").
    .replace(/[\u0300-\u036f]/g, '')
    // Apostrophes and ʻokina are dropped rather than replaced by a dash.
    .replace(/[\u02BB\u02BC\u2018\u2019']/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Whether the value already is a canonical slug, i.e. `slugify` leaves it
 * untouched. Keeps validation in sync with generation.
 */
export function isSlug(value: string): boolean {
  return value.length > 0 && slugify(value) === value
}
