export const CELESTIAL_BODY_TYPES = ['Planet', 'Moon', 'Star', 'Asteroid', 'Comet', 'Dwarf planet'] as const

export const CELESTIAL_BODY_TYPE_ORDER: Record<typeof CELESTIAL_BODY_TYPES[number], number> = {
  'Planet': 1,
  'Moon': 2,
  'Asteroid': 3,
  'Comet': 4,
  'Dwarf planet': 5,
  'Star': 6
}
