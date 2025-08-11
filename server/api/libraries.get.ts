import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export default defineEventHandler(() => {
  const contentDir = path.join(process.cwd(), 'content', 'libraries')
  if (!fs.existsSync(contentDir)) return []
  const directories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
  return directories.map((dir, idx) => {
    const indexPath = path.join(contentDir, dir, 'index.md')
    if (!fs.existsSync(indexPath)) return null
    try {
      const raw = fs.readFileSync(indexPath, 'utf8')
      const { data, content } = matter(raw)
      const first = content.split('\n').filter(l => l.trim() && !l.startsWith('#'))[0] || ''
      return {
        id: idx + 1,
        slug: dir,
        title: data.title || dir,
        location: data.location,
        photo: data.photo || '/images/libraries/placeholder-library.jpg',
        tags: data.tags || [],
        description: first.length > 200 ? first.slice(0,200) + '…' : first,
        _path: `/libraries/${dir}`
      }
    } catch { return null }
  }).filter(Boolean)
})
