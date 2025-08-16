// Utility function to fetch full library content using proper Nuxt/Content patterns

export async function fetchLibraryContent(libraryPath: string): Promise<any | null> {
  try {
    // Use queryContent with proper auto-imports
    const content = await queryContent(libraryPath).findOne()
    return content || null
  } catch (error) {
    console.error('Error fetching library content:', error)
    return null
  }
}
