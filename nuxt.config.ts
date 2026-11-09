// https://nuxt.com/docs/api/configuration/nuxt-config

// Workaround: libsql hangs/crashes (exit code 3221225477) when its native addon is loaded
// only in worker threads, which is what Nitro's dev server does on every reload.
// Loading it once in the main process avoids it. Remove once fixed upstream (issue : https://github.com/tursodatabase/libsql-js/issues/249).

import '@libsql/client'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxthub/core',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-charts'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark'
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'error',
        'neutral',
        // Custom colors
        'rock',
        'star',
        'stardust',
        'earth'
      ]
    }
  },

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

  debug: true,

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    defaultLocale: 'fr',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'fr',
        language: 'fr-FR',
        name: 'Français',
        file: 'fr.json'
      }
    ],
    experimental: {
      typedOptionsAndMessages: 'default'
    }
  }
})
