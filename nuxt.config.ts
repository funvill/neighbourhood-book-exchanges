// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui'
  ],

  // UI and theming configuration
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },

  // Custom theme with Material Design principles
  css: ['~/assets/css/main.css'],

  // App configuration
  app: {
    head: {
      title: 'Puzzle Pages - Community Library Puzzles',
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
  },

  // Content configuration for our library content
  content: {
    highlight: {
      theme: 'github-light'
    }
  }
})