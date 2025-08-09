// ESM script to assign sequential zero-padded library_id values to content/libraries/*/index.md
// Only adds library_id if missing. Existing IDs are preserved.
// Tracks the last issued ID in .library-id-counter.json at repo root.
// Usage: npm run assign:library-ids
import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const LIBRARIES_DIR = path.resolve('content', 'libraries')
const COUNTER_FILE = path.resolve('.library-id-counter.json')
const PAD_LENGTH = 5

async function deriveMaxExistingId() {
  let maxId = 0
  try {
    const dirs = await readdir(LIBRARIES_DIR)
    for (const dir of dirs) {
      if (dir.startsWith('.')) continue
      const indexPath = path.join(LIBRARIES_DIR, dir, 'index.md')
      try {
        const s = await stat(indexPath)
        if (!s.isFile()) continue
        const raw = await readFile(indexPath, 'utf8')
        const fm = matter(raw)
        const existing = fm.data.library_id
        if (existing) {
          const numeric = parseInt(String(existing).replace(/^0+/, ''), 10)
          if (!Number.isNaN(numeric) && numeric > maxId) maxId = numeric
        }
      } catch { /* skip */ }
    }
  } catch { /* dir missing */ }
  return maxId
}

async function loadCounter() {
  try {
    const raw = await readFile(COUNTER_FILE, 'utf8')
    const data = JSON.parse(raw)
    if (typeof data.last_id === 'number' && data.last_id >= 0) return data
  } catch { /* ignore */ }
  return { last_id: await deriveMaxExistingId() }
}

async function saveCounter(counter) {
  await writeFile(COUNTER_FILE, JSON.stringify(counter, null, 2) + '\n', 'utf8')
}

function padId(id) {
  return String(id).padStart(PAD_LENGTH, '0')
}

async function assignIds() {
  const counter = await loadCounter()
  let updated = 0
  let skipped = 0
  let dirs = []
  try {
    dirs = (await readdir(LIBRARIES_DIR)).filter(n => !n.startsWith('.'))
  } catch {
    console.error('Libraries directory not found:', LIBRARIES_DIR)
    process.exit(1)
  }
  dirs.sort((a, b) => a.localeCompare(b, 'en'))

  // Validate existing IDs for duplicates before making any changes
  const idMap = new Map() // id -> array of dirs
  for (const dir of dirs) {
    const indexPath = path.join(LIBRARIES_DIR, dir, 'index.md')
    try {
      const s = await stat(indexPath)
      if (!s.isFile()) continue
      const raw = await readFile(indexPath, 'utf8')
      const parsed = matter(raw)
      const existingId = parsed.data.library_id
      if (existingId) {
        const norm = String(existingId).trim()
        const list = idMap.get(norm) || []
        list.push(dir)
        idMap.set(norm, list)
      }
    } catch { /* ignore */ }
  }
  const duplicates = [...idMap.entries()].filter(([, list]) => list.length > 1)
  if (duplicates.length) {
    console.error('\nDuplicate library_id values detected:')
    for (const [dupId, list] of duplicates) {
      console.error(`  ${dupId}: ${list.join(', ')}`)
    }
    console.error('\nResolve duplicates before assigning new IDs. Aborting.')
    process.exit(2)
  }

  for (const dir of dirs) {
    const indexPath = path.join(LIBRARIES_DIR, dir, 'index.md')
    try {
      const s = await stat(indexPath)
      if (!s.isFile()) continue
      const raw = await readFile(indexPath, 'utf8')
      const parsed = matter(raw)
      if (parsed.data.library_id) { skipped++; continue }
      counter.last_id += 1
      parsed.data.library_id = padId(counter.last_id)
      const newContent = matter.stringify(parsed.content, parsed.data)
      await writeFile(indexPath, newContent, 'utf8')
      updated++
      console.log(`Assigned library_id ${parsed.data.library_id} -> ${dir}`)
    } catch (e) {
      console.warn(`Skipping ${dir}: ${e.message}`)
    }
  }
  if (updated > 0) await saveCounter(counter)
  console.log(`Done. Updated: ${updated}, already had ID: ${skipped}, last_id now: ${counter.last_id}`)
}

assignIds().catch(err => { console.error(err); process.exit(1) })
