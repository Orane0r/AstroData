import type { Color } from '~/types/color'

/**
 * Config for displaying bodies on screen.
 */
type BodyTypeConfig = Record<CelestialBody['type'], {
  label: string
  color: Color
  icon: string
  order: number
}>

export const BODY_TYPE_CONFIG: BodyTypeConfig = {
  'Planet': {
    label: 'Planète',
    color: 'primary',
    icon: 'i-solar-planet-outline',
    order: 1
  },
  'Moon': {
    label: 'Lune',
    color: 'rock',
    icon: 'i-solar-moon-outline',
    order: 2
  },
  'Asteroid': {
    label: 'Astéroïde',
    color: 'rock',
    icon: 'i-solar-asteroid-outline',
    order: 3
  },
  'Comet': {
    label: 'Comète',
    color: 'stardust',
    icon: 'i-solar-star-fall-minimalistic-outline',
    order: 4
  },
  'Dwarf planet': {
    label: 'Planète naine',
    color: 'earth',
    icon: 'i-solar-planet-3-outline',
    order: 5
  },
  'Star': {
    label: 'Étoile',
    color: 'star',
    icon: 'i-solar-star-outline',
    order: 6
  }
}
