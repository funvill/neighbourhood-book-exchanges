// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'node:fs'
import path from 'node:path'

// Collect library slugs at build time so their pages & API endpoints are prerendered for static hosting
const librariesDir = path.resolve('content', 'libraries')
let librarySlugs: string[] = []
try {
  librarySlugs = fs.readdirSync(librariesDir)
    .filter(name => {
      try {
        return fs.statSync(path.join(librariesDir, name)).isDirectory() && fs.existsSync(path.join(librariesDir, name, 'index.md'))
      } catch { return false }
    })
} catch {
  // directory might not exist yet during certain build phases; ignore
  librarySlugs = []
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Removed debug:true to avoid duplicate console.time label warnings in Node output

  nitro: {
    prerender: {
      routes: [
        // Dynamic library detail pages
        ...librarySlugs.map(slug => `/library/${slug}`)
      ],
      // Continue generating even if some routes fail
      failOnError: true
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],

  // Image optimization configuration
  image: {
    // The quality should be a number between 0 and 100
    quality: 80,
    // Image formats
    format: ['webp', 'jpg'],
    // Reduce image processing for development and static builds
    provider: 'ipx',
    ipx: {
      // Reduce concurrent processing to avoid repeated requests
      maxAge: 60 * 60 * 24 * 7, // 7 days cache
    }
  },

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