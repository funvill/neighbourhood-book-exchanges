// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    prerender: {      
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],

  // Custom theme with Material Design principles
  css: [
    '~/assets/main.css', // Google Material Design theme
  ],

  // App configuration
  app: {
    head: {
      title: 'Neighbourhood book exchanges - Community Library Network',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover tiny libraries, solve puzzles, and unlock community mysteries' },
        { name: 'theme-color', content: '#3b82f6' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})