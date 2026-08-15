import { CELESTIAL_BODY_TYPE_ORDER } from '~~/shared/constants/db'
import type { CelestialBodyType } from '~~/shared/types/db'
import type { Color } from '~/types/color'

/**
 * Config for displaying bodies on screen.
 */
type BodyTypeConfig = Record<CelestialBodyType, {
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
    order: CELESTIAL_BODY_TYPE_ORDER.Planet
  },
  'Moon': {
    label: 'Lune',
    color: 'rock',
    icon: 'i-solar-moon-outline',
    order: CELESTIAL_BODY_TYPE_ORDER.Moon
  },
  'Asteroid': {
    label: 'Astéroïde',
    color: 'rock',
    icon: 'i-solar-asteroid-outline',
    order: CELESTIAL_BODY_TYPE_ORDER.Asteroid
  },
  'Comet': {
    label: 'Comète',
    color: 'stardust',
    icon: 'i-solar-star-fall-minimalistic-outline',
    order: CELESTIAL_BODY_TYPE_ORDER.Comet
  },
  'Dwarf planet': {
    label: 'Planète naine',
    color: 'earth',
    icon: 'i-solar-planet-3-outline',
    order: CELESTIAL_BODY_TYPE_ORDER['Dwarf planet']
  },
  'Star': {
    label: 'Étoile',
    color: 'star',
    icon: 'i-solar-star-outline',
    order: CELESTIAL_BODY_TYPE_ORDER.Star
  }
}
