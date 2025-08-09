import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default defineEventHandler(async (_event) => {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'libraries')
    const directories = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    const libraries = []

    for (const dir of directories) {
      const indexPath = path.join(contentDir, dir, 'index.md')
      if (fs.existsSync(indexPath)) {
        try {
          const fileContent = fs.readFileSync(indexPath, 'utf-8')
          const { data, content } = matter(fileContent)
          const stats = fs.statSync(indexPath)
          
          // Count logbook entries dynamically
          const logbookDir = path.join(contentDir, dir, 'logbook')
          let logbookCount = 0
          if (fs.existsSync(logbookDir)) {
            const logbookFiles = fs.readdirSync(logbookDir).filter(file => file.endsWith('.md'))
            logbookCount = logbookFiles.length
          }
          
          libraries.push({
            id: libraries.length + 1,
            slug: dir,
            title: data.title || 'Untitled Library',
            location: data.location || { lat: 49.2827, lng: -123.1207, address: 'Unknown' },
            photo: data.photo || '/images/libraries/placeholder-library.jpg',
            description: content.split('\n').slice(0, 3).join(' ').substring(0, 200) + '...',
            tags: data.tags || [],
            entries_count: logbookCount, // Use dynamic count instead of frontmatter
            _path: `/${dir}`,
            lastModified: stats.mtime.toISOString()
          })
        } catch (error) {
          console.warn(`Error processing ${dir}:`, error)
        }
      }
    }

    return libraries
  } catch (error) {
    console.error('Error fetching libraries:', error)
    return []
  }
})
