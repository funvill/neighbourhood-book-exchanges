#!/usr/bin/env node
/**
 * Maintenance Script: Convert all JPG/JPEG images inside folders matching this conceptual pattern:
 *   content/libraries/(any nested path)/logbook/*.jpg
 * (Glob variant often written with a double-star segment between libraries and logbook.)
 *
 * Steps:
 * 1. Recursively find logbook folders under content/libraries.
 * 2. For each *.jpg or *.jpeg file, load it and re-encode as PNG (same base name, .png extension).
 * 3. Remove the original jpg/jpeg after successful conversion.
 * 4. Skip if a .png with the same target name already exists.
 *
 * Usage:
 *   node scripts/maintence_jpg_to_png.mjs            # real run
 *   node scripts/maintence_jpg_to_png.mjs --dry-run  # show actions only
 *
 * Notes:
 * - This uses the built-in sharp-like dynamic import attempt; if sharp isn't available, we fall back to canvas (optional minimal) attempt is omitted.
 * - To keep dependencies minimal, we implement a tiny wrapper around sharp. Install sharp if not present: npm install sharp --save-dev
 * - If sharp is missing and can't be imported, the script will exit with instructions.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

const DRY_RUN = process.argv.includes('--dry-run')
const ROOT = path.resolve(process.cwd())
const LIB_ROOT = path.join(ROOT, 'content', 'libraries')

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
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield full
      yield* walk(full)
    }
  }
}

async function findJpgFiles() {
  const matches = []
  for await (const d of walk(LIB_ROOT)) {
    if (d.toLowerCase().endsWith(path.sep + 'logbook')) {
      const list = await fs.readdir(d, { withFileTypes: true })
      for (const f of list) {
        if (!f.isFile()) continue
        if (/\.(jpe?g)$/i.test(f.name)) {
          matches.push(path.join(d, f.name))
        }
      }
    }
  }
  return matches
}

function targetPngPath(jpgPath) {
  const dir = path.dirname(jpgPath)
  const base = path.basename(jpgPath).replace(/\.(jpe?g)$/i, '')
  return path.join(dir, base + '.png')
}

async function convert(sharp, jpgFile) {
  const pngFile = targetPngPath(jpgFile)
  // If PNG exists already, skip.
  try {
    await fs.access(pngFile)
    return { jpgFile, pngFile, skipped: true, reason: 'png-exists' }
  } catch { /* no png yet */ }

  if (DRY_RUN) {
    return { jpgFile, pngFile, converted: false, dryRun: true }
  }

  console.log(`Converting ${jpgFile} to ${pngFile}...`)

  try {
    const buf = await fs.readFile(jpgFile)
    const out = await sharp(buf).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
    await fs.writeFile(pngFile, out)
    // sanity: ensure png wrote
    await fs.access(pngFile)
    await fs.unlink(jpgFile)
    return { jpgFile, pngFile, converted: true }
  } catch (e) {
    return { jpgFile, pngFile, converted: false, error: e.message }
  }
}

async function main() {
  try {
    const sharp = await ensureSharp()
    const jpgFiles = await findJpgFiles()
    if (jpgFiles.length === 0) {
      console.log('No JPG files found under logbook folders.')
      return
    }
    console.log(`Found ${jpgFiles.length} JPG file(s). Processing...`)
    const results = []
    for (const f of jpgFiles) {
      results.push(await convert(sharp, f))
    }

    for (const r of results) {
      if (r.converted) {
        console.log(`CONVERTED ${r.jpgFile} -> ${r.pngFile}`)
      } else if (r.dryRun) {
        console.log(`DRY-RUN   ${r.jpgFile} -> ${r.pngFile}`)
      } else if (r.skipped) {
        console.log(`SKIP      ${r.jpgFile} (${r.reason})`)
      } else if (r.error) {
        console.log(`ERROR     ${r.jpgFile}: ${r.error}`)
      }
    }

    const summary = {
      total: results.length,
      converted: results.filter(r => r.converted).length,
      dryRun: results.filter(r => r.dryRun).length,
      skipped: results.filter(r => r.skipped).length,
      errors: results.filter(r => r.error).length
    }
    console.log('\nSummary:', summary)
    if (DRY_RUN) console.log('\n(Re-run without --dry-run to apply)')
  } catch (e) {
    console.error('Fatal error:', e)
    process.exit(1)
  }
}

main()
