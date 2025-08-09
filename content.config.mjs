export default {
  // This forces @nuxt/content to ignore cache and parse all files
  cache: false,
  // Define sources explicitly  
  sources: {
    content: {
      driver: 'fs',
      base: './content'
    }
  }
}
