import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Library slug is required'
      })
    }

    const contentDir = path.join(process.cwd(), 'content')
    const indexPath = path.join(contentDir, slug, 'index.md')
    
    if (!fs.existsSync(indexPath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Library not found'
      })
    }

    const fileContent = fs.readFileSync(indexPath, 'utf-8')
    const { data, content } = matter(fileContent)
    const stats = fs.statSync(indexPath)
    
    // Count logbook entries dynamically
    const logbookDir = path.join(contentDir, slug, 'logbook')
    let logbookCount = 0
    if (fs.existsSync(logbookDir)) {
      const logbookFiles = fs.readdirSync(logbookDir).filter(file => file.endsWith('.md'))
      logbookCount = logbookFiles.length
    }
    
    return {
      id: 1, // We could use a hash of the slug or similar
      slug: slug,
      title: data.title || 'Untitled Library',
      location: data.location || { lat: 49.2827, lng: -123.1207, address: 'Unknown' },
      photo: data.photo || '/images/libraries/placeholder-library.jpg',
      description: content.split('\n').slice(0, 3).join(' ').substring(0, 200) + '...',
      fullContent: content, // Include the full markdown content
      tags: data.tags || [],
      established: data.established || 'unknown',
      entries_count: logbookCount, // Use dynamic count instead of frontmatter
      _path: `/${slug}`,
      lastModified: stats.mtime.toISOString(),
      frontmatter: data // Include all frontmatter data
    }
  } catch (error) {
    console.error('Error fetching library:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error loading library data'
    })
  }
})
