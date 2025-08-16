#!/usr/bin/env node
/**
 * Maintenance Script: Convert all JPG/JPEG images in library-images directory
 *   public/library-images/ (all subdirectories) / (any jpg files)
 *
 * Steps:
 * 1. Recursively find all directories under public/library-images.
 * 2. For each *.jpg or *.jpeg file, load it and re-encode as PNG (same base name, .png extension).
 * 3. Remove the original jpg/jpeg after successful conversion.
 * 4. Skip if a .png with the same target name already exists.
 *
 * Usage:
 *   node scripts/maintenance_jpg_to_png.mjs            # real run
 *   node scripts/maintenance_jpg_to_png.mjs --dry-run  # show actions only
 *
 * Notes:
 * - This uses sharp for image conversion. Install sharp if not present: npm install sharp --save-dev
 * - If sharp is missing and can't be imported, the script will exit with instructions.
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const ROOT = path.resolve(process.cwd())
const IMAGES_ROOT = path.join(ROOT, 'public', 'library-images')

async function ensureSharp() {
  try {
    const sharp = (await import('sharp')).default
    return sharp
  } catch {
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
  try {
    // Check if IMAGES_ROOT exists
    await fs.access(IMAGES_ROOT)
  } catch {
    console.log(`Directory ${IMAGES_ROOT} not found. No JPG files to process.`)
    return matches
  }

  for await (const d of walk(IMAGES_ROOT)) {
    // Look in all directories under library-images (not just logbook folders)
    const list = await fs.readdir(d, { withFileTypes: true })
    for (const f of list) {
      if (!f.isFile()) continue
      if (/\.(jpe?g)$/i.test(f.name)) {
        matches.push(path.join(d, f.name))
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
  
  // Check if PNG exists already
  const pngExists = await fs.access(pngFile).then(() => true).catch(() => false)
  
  if (pngExists) {
    // PNG already exists, just remove the JPG file
    if (DRY_RUN) {
      return { jpgFile, pngFile, converted: false, dryRun: true, action: 'remove-jpg' }
    }
    
    console.log(`Removing JPG file (PNG exists): ${jpgFile}`)
    try {
      await fs.unlink(jpgFile)
      console.log(`  ✓ Removed JPG file`)
      return { jpgFile, pngFile, converted: false, removed: true }
    } catch (error) {
      return { jpgFile, pngFile, converted: false, error: error.message }
    }
  }

  // PNG doesn't exist, convert JPG to PNG
  if (DRY_RUN) {
    return { jpgFile, pngFile, converted: false, dryRun: true, action: 'convert' }
  }

  console.log(`Converting ${jpgFile} to ${pngFile}...`)

  try {
    const buf = await fs.readFile(jpgFile)
    const out = await sharp(buf).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
    await fs.writeFile(pngFile, out)
    
    // Verify PNG was written successfully
    await fs.access(pngFile)
    const pngStats = await fs.stat(pngFile)
    if (pngStats.size === 0) {
      throw new Error('Generated PNG file is empty')
    }
    
    // Remove original JPG file only after successful PNG creation
    await fs.unlink(jpgFile)
    console.log(`  ✓ Converted and removed original JPG`)
    
    return { jpgFile, pngFile, converted: true }
  } catch (error) {
    return { jpgFile, pngFile, converted: false, error: error.message }
  }
}

async function main() {
  try {
    console.log(`Looking for JPG files in: ${IMAGES_ROOT}`)
    const sharp = await ensureSharp()
    const jpgFiles = await findJpgFiles()
    
    if (jpgFiles.length === 0) {
      console.log('No JPG files found in library-images directory.')
      return
    }
    
    console.log(`Found ${jpgFiles.length} JPG file(s). Processing...`)
    if (DRY_RUN) {
      console.log('DRY RUN MODE - no files will be modified\n')
    }
    
    const results = []
    for (const f of jpgFiles) {
      results.push(await convert(sharp, f))
    }

    console.log('\nResults:')
    for (const r of results) {
      if (r.converted) {
        console.log(`✓ CONVERTED ${r.jpgFile} -> ${r.pngFile}`)
      } else if (r.removed) {
        console.log(`✓ REMOVED   ${r.jpgFile} (PNG already existed)`)
      } else if (r.dryRun && r.action === 'convert') {
        console.log(`○ DRY-RUN   ${r.jpgFile} -> ${r.pngFile} (convert)`)
      } else if (r.dryRun && r.action === 'remove-jpg') {
        console.log(`○ DRY-RUN   ${r.jpgFile} (remove JPG, PNG exists)`)
      } else if (r.error) {
        console.log(`✗ ERROR     ${r.jpgFile}: ${r.error}`)
      }
    }

    const summary = {
      total: results.length,
      converted: results.filter(r => r.converted).length,
      removed: results.filter(r => r.removed).length,
      dryRun: results.filter(r => r.dryRun).length,
      errors: results.filter(r => r.error).length
    }
    
    console.log('\nSummary:', summary)
    if (DRY_RUN) {
      console.log('\n(Re-run without --dry-run to apply changes)')
    } else if (summary.converted > 0 || summary.removed > 0) {
      console.log(`\n✓ Successfully processed ${summary.converted + summary.removed} JPG files`)
      if (summary.converted > 0) console.log(`  - Converted: ${summary.converted} files`)
      if (summary.removed > 0) console.log(`  - Removed: ${summary.removed} files (PNG already existed)`)
    }
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()
