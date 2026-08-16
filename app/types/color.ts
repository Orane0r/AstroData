/**
 * NuxtUI semantic colors.
 */
export type Color = DefaultColor | CustomColor

/**
 * Default NuxtUI colors. Do not edit.
 */
export type DefaultColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

/**
 * Custom NuxtUI colors. Edit when new color is added in `nuxt.config.ts` or `app.config.ts`.
 */
export type CustomColor = 'rock' | 'star' | 'stardust' | 'earth'
