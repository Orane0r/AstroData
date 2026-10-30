import { CELESTIAL_BODY_TYPE_ORDER } from '~~/shared/constants/db'
import type { CelestialBodyType } from '~~/shared/types/db'
import type { Color } from '~/types/color'

/**
 * Config for displaying bodies on screen.
 */
type BodyTypeConfig = Record<CelestialBodyType, {
  label: string
  pluralLabel: string
  color: Color
  icon: string
  order: number
}>

/**
 * Must be called in a `setup` function (uses `useI18n`).
 */
export function useBodyTypeConfig(): BodyTypeConfig {
  const { t } = useI18n()

  return {
    'Planet': {
      label: t('body_types.planet'),
      pluralLabel: t('body_types.plural.planet'),
      color: 'primary',
      icon: 'i-solar-planet-outline',
      order: CELESTIAL_BODY_TYPE_ORDER.Planet
    },
    'Moon': {
      label: t('body_types.moon'),
      pluralLabel: t('body_types.plural.moon'),
      color: 'rock',
      icon: 'i-solar-moon-outline',
      order: CELESTIAL_BODY_TYPE_ORDER.Moon
    },
    'Asteroid': {
      label: t('body_types.asteroid'),
      pluralLabel: t('body_types.plural.asteroid'),
      color: 'rock',
      icon: 'i-solar-asteroid-outline',
      order: CELESTIAL_BODY_TYPE_ORDER.Asteroid
    },
    'Comet': {
      label: t('body_types.comet'),
      pluralLabel: t('body_types.plural.comet'),
      color: 'stardust',
      icon: 'i-solar-star-fall-minimalistic-outline',
      order: CELESTIAL_BODY_TYPE_ORDER.Comet
    },
    'Dwarf planet': {
      label: t('body_types.dwarf_planet'),
      pluralLabel: t('body_types.plural.dwarf_planet'),
      color: 'earth',
      icon: 'i-solar-planet-3-outline',
      order: CELESTIAL_BODY_TYPE_ORDER['Dwarf planet']
    },
    'Star': {
      label: t('body_types.star'),
      pluralLabel: t('body_types.plural.star'),
      color: 'star',
      icon: 'i-solar-star-outline',
      order: CELESTIAL_BODY_TYPE_ORDER.Star
    }
  }
}
