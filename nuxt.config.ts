// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

// Collect library files at build time so their pages & API endpoints are prerendered for static hosting
const librariesDir = path.resolve('content', 'libraries')
let librarySlugs: string[] = []
let libraryManifest: any = { libraries: [] }

try {
  // NEW: Read flattened .md files instead of directories
  librarySlugs = fs.readdirSync(librariesDir)
    .filter(name => {
      try {
        return name.endsWith('.md') && fs.statSync(path.join(librariesDir, name)).isFile()
      } catch { return false }
    })

  // Build library manifest for route generation by reading actual frontmatter
  try {
    const libraries: any[] = []
    for (const filename of librarySlugs) {
      try {
        const filePath = path.join(librariesDir, filename)
        const content = fs.readFileSync(filePath, 'utf8')
        const frontmatter = matter(content)
        const libraryId = frontmatter.data.library_id
        if (libraryId) {
          const title: string = frontmatter.data.title || filename.replace('.md', '')
          const titleSlug = title.toLowerCase()
            .normalize('NFKD')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-') || filename.replace('.md', '')
          libraries.push({
            library_id: String(libraryId),
            slug: titleSlug,
            title,
            folder: filename.replace('.md', '') // Keep for compatibility
          })
        }
      } catch {
        // Skip if can't read frontmatter
      }
    }
    libraryManifest.libraries = libraries
  } catch {
    // If frontmatter reading fails, fall back to legacy slug-only routes
  }
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
        // Canonical /library/{id}/{slug} routes (legacy single-param prerender removed 2025-08-10 after 301 cutover)
        ...libraryManifest.libraries.map((l: any) => `/library/${String(l.library_id).padStart(5,'0')}/${l.slug}`)
      ],
      // Continue generating even if some routes fail
      failOnError: false
  }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],

  // Note: Logbook entry markdown files are now included in content indexing to support library page logbook sections
  content: {
    // Remove ignores to allow library logbook entries to be queryable
    // ignores: ['/logbook/*.md']
  },

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