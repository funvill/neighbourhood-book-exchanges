import fs from 'node:fs'
import path from 'node:path'
import { defineEventHandler, getRouterParams, setHeader, createError, sendStream } from 'h3'

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif'
}

export default defineEventHandler((event) => {
  const params = getRouterParams(event) as any
  const slug = params.slug
  const rest = params.path
  if (!slug || !rest) {
    throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
  }
  const parts = Array.isArray(rest) ? rest : String(rest).split('/')
  const relative = parts.join('/')
  const baseDir = path.join(process.cwd(), 'content', 'libraries', slug)
  const filePath = path.join(baseDir, relative)
  if (!filePath.startsWith(baseDir)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden path' })
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }
  const ext = path.extname(filePath).toLowerCase()
  setHeader(event, 'Content-Type', MIME[ext] || 'application/octet-stream')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
  return sendStream(event, fs.createReadStream(filePath))
})
