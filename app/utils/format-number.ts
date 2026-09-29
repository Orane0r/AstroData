import { useI18n } from '#imports'

/**
 * Formats a number with the current locale.
 */
export const formatNumber = (
  value: number,
  maximumFractionDigits = 2
) => {
  const { locale } = useI18n()

  return new Intl.NumberFormat(locale.value, {
    maximumFractionDigits
  }).format(value)
}
