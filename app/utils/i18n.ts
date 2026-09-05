import enMessages from '../../i18n/locales/en.json'
import frMessages from '../../i18n/locales/fr.json'

type TranslationKey = keyof typeof enMessages & keyof typeof frMessages

export const I18N = Object.fromEntries(
  Object.keys(enMessages)
    .filter(key => key in frMessages)
    .map(key => [key, key])
) as Record<TranslationKey, TranslationKey>
