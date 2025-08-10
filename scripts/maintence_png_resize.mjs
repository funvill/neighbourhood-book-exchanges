#!/usr/bin/env node
/**
 * Maintenance Script: Resize all PNG images under the content/ directory so that
 * the largest dimension (width or height) is at most 800px while preserving aspect ratio.
 *
 * Features:
 * - Recursively walks content/.
 * - Processes *.png (case-insensitive).
 * - Skips files already <= 800px in both dimensions.
 * - Overwrites the original file (optionally creates a backup with --backup).
 * - Dry-run support (shows intended actions only) with --dry-run.
 * - Concurrency limiting to avoid exhausting resources.
 *
 * Caveats:
 * - Animated PNGs will be flattened to a single frame by sharp.
 * - Metadata may be lost after re-encoding (profiles/EXIF stripped by default).
 *
 * Usage:
 *   node scripts/maintence_png_resize.mjs --dry-run     # preview changes
 *   node scripts/maintence_png_resize.mjs               # perform resize in-place
 *   node scripts/maintence_png_resize.mjs --backup      # keep .orig backup copies
 *   node scripts/maintence_png_resize.mjs --dry-run --backup
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const MAKE_BACKUP = process.argv.includes('--backup')
const ROOT = path.resolve(process.cwd())
const CONTENT_ROOT = path.join(ROOT, 'content')
const MAX_DIM = 800
const CONCURRENCY = 4

async function ensureSharp() {
  try {
    const sharp = (await import('sharp')).default
    return sharp
  } catch (e) {
    console.error('[ERROR] sharp module not found. Install it first: npm install sharp --save-dev')
    process.exit(1)
  }
}

async function* walk(dir) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else if (/\.png$/i.test(entry.name)) {
      yield full
    }
  }
}

async function collectPngs() {
  const list = []
  for await (const f of walk(CONTENT_ROOT)) list.push(f)
  return list
}

async function resizeFile(sharp, file) {
  let meta
  try {
    meta = await sharp(file).metadata()
  } catch (e) {
    return { file, skipped: true, reason: 'metadata-error', error: e.message }
  }
  const w = meta.width || 0
  const h = meta.height || 0
  if (!w || !h) {
    return { file, skipped: true, reason: 'no-dimensions' }
  }
  if (w <= MAX_DIM && h <= MAX_DIM) {
    return { file, skipped: true, reason: 'already-small', width: w, height: h }
  }

  if (DRY_RUN) {
    return { file, width: w, height: h, target: MAX_DIM, dryRun: true }
  }

  const backupPath = file + '.orig'
  try {
    if (MAKE_BACKUP) {
      try { await fs.access(backupPath) } catch { await fs.copyFile(file, backupPath) }
    }
    const pipeline = await sharp(file)
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer()
    await fs.writeFile(file, pipeline)
    return { file, resized: true, oldWidth: w, oldHeight: h }
  } catch (e) {
    return { file, resized: false, error: e.message }
  }
}

async function runQueue(sharp, files) {
  const results = []
  let index = 0
  async function worker() {
    while (index < files.length) {
      const i = index++
      const f = files[i]
      results[i] = await resizeFile(sharp, f)
    }
  }
  const workers = Array.from({ length: Math.min(CONCURRENCY, files.length) }, () => worker())
  await Promise.all(workers)
  return results
}

async function main() {
  const sharp = await ensureSharp()
  const pngs = await collectPngs()
  if (pngs.length === 0) {
    console.log('No PNG files found under content/.')
    return
  }
  console.log(`Found ${pngs.length} PNG file(s). Evaluating...`)
  const results = await runQueue(sharp, pngs)

  for (const r of results) {
    if (r.resized) {
      console.log(`RESIZED  ${r.file} (${r.oldWidth}x${r.oldHeight} -> <=${MAX_DIM})`)
    } else if (r.dryRun) {
      console.log(`DRY-RUN  ${r.file} (${r.width}x${r.height} -> <=${MAX_DIM})`)
    } else if (r.skipped) {
      console.log(`SKIP     ${r.file} (${r.reason}${r.width ? ' ' + r.width + 'x' + r.height : ''})`)
    } else if (r.error) {
      console.log(`ERROR    ${r.file}: ${r.error}`)
    }
  }

  const summary = {
    total: results.length,
    resized: results.filter(r => r.resized).length,
    dryRun: results.filter(r => r.dryRun).length,
    skipped: results.filter(r => r.skipped).length,
    errors: results.filter(r => r.error).length
  }
  console.log('\nSummary:', summary)
  if (DRY_RUN) console.log('\n(Re-run without --dry-run to apply)')
  else if (MAKE_BACKUP) console.log('\nBackups (.orig) created where resizing occurred.')
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1) })
