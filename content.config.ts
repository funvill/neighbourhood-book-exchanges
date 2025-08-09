import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  // Content directory
  dir: 'content',
  
  // Markdown options
  markdown: {
    // Syntax highlighting
    highlight: {
      theme: 'github-light'
    }
  },

  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    })
  }
})
