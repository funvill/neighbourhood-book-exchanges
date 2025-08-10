// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

// Collect library slugs at build time so their pages & API endpoints are prerendered for static hosting
const librariesDir = path.resolve('content', 'libraries')
let librarySlugs: string[] = []
let libraryManifest: any = { libraries: [] }

try {
  librarySlugs = fs.readdirSync(librariesDir)
    .filter(name => {
      try {
        return fs.statSync(path.join(librariesDir, name)).isDirectory() && fs.existsSync(path.join(librariesDir, name, 'index.md'))
      } catch { return false }
    })

  // Build library manifest for route generation by reading actual frontmatter
  try {
    const libraries: any[] = []
    for (const slug of librarySlugs) {
      try {
        const indexPath = path.join(librariesDir, slug, 'index.md')
        const content = fs.readFileSync(indexPath, 'utf8')
        const frontmatter = matter(content)
        const libraryId = frontmatter.data.library_id
        if (libraryId) {
          libraries.push({
            library_id: String(libraryId),
            slug,
            title: frontmatter.data.title || slug
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
        // For now, keep legacy slug-only routes to avoid breaking prerender
        // The new ID-slug routes will work at runtime with redirects
        ...librarySlugs.map(slug => `/library/${slug}`)
      ],
      // Continue generating even if some routes fail
      failOnError: false
    },
    // Generate library manifest during build
    hooks: {
      'build:done': async () => {
        try {
          const { writeFile, mkdir } = await import('node:fs/promises')
          const { generateLibraryManifestJson } = await import('./utils/libraryManifest')
          
          // Ensure public directory exists
          await mkdir('public', { recursive: true })
          
          // Generate and write manifest
          const manifestJson = await generateLibraryManifestJson()
          await writeFile('public/library-manifest.json', manifestJson, 'utf8')
          console.log('✓ Generated library manifest at public/library-manifest.json')
        } catch (error) {
          console.warn('Failed to generate library manifest:', error)
        }
      }
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],

  // Exclude logbook entry markdown files from @nuxt/content indexing/search
  content: {
    // User requested pattern; matches top-level /logbook folders under content root.
    // If nested library paths need exclusion, consider changing to '**/logbook/*.md'
    ignores: ['/logbook/*.md']
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