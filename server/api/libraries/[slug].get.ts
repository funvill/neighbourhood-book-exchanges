import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export default defineEventHandler((event) => {
  const slug = event.context.params?.slug as string
  const file = path.join(process.cwd(), 'content', 'libraries', slug, 'index.md')
  if (!fs.existsSync(file)) {
    setResponseStatus(event, 404)
    return { error: 'Not found' }
  }
  try {
    const raw = fs.readFileSync(file, 'utf8')
    const parsed = matter(raw)
    return { slug, ...parsed.data, body: parsed.content }
  } catch (e) {
    setResponseStatus(event, 500)
    return { error: 'Failed to read', details: (e as Error).message }
  }
})
