import type { Color } from '~/types/color'

type BodyTypeConfig = Record<CelestialBody['type'], {
  label: string
  color: Color
  icon: string
}>

export const BODY_TYPE_CONFIG: BodyTypeConfig = {
  'Planet': {
    label: 'Planète',
    color: 'primary',
    icon: 'i-solar-planet-outline'
  },
  'Moon': {
    label: 'Lune',
    color: 'rock',
    icon: 'i-solar-moon-outline'
  },
  'Star': {
    label: 'Étoile',
    color: 'star',
    icon: 'i-solar-star-outline'
  },
  'Asteroid': {
    label: 'Astéroïde',
    color: 'rock',
    icon: 'i-solar-asteroid-outline'
  },
  'Comet': {
    label: 'Comète',
    color: 'stardust',
    icon: 'i-solar-star-fall-minimalistic-outline'
  },
  'Dwarf planet': {
    label: 'Planète naine',
    color: 'earth',
    icon: 'i-solar-planet-3-outline'
  }
}
