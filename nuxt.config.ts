// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxthub/core'
  ],

  devtools: {

    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  sourcemap: {
    server: true,
    client: true
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    experimental: {
      tasks: true
    }
  },

  hub: {
    db: 'sqlite'
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
