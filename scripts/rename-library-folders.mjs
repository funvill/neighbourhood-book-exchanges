#!/usr/bin/env node
/**
 * One-off script: Prefix each content/libraries/<folder> with its library_id from index.md frontmatter.
 * Result: content/libraries/<library_id>-<original-folder-name>
 *
 * Usage:
 *   node scripts/rename-library-folders.mjs          # executes renames
 *   node scripts/rename-library-folders.mjs --dry-run # only shows what would change
 *
 * Safety:
 * - Skips folders without index.md or missing library_id.
 * - Skips if folder already begins with the same library_id + '-'.
 * - Skips if target folder already exists (reports collision).
 * - No recursive content rewrite; internal links/refs depending on old slug may break.
 *   Ensure application logic can handle new slug pattern before committing.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = path.resolve(process.cwd())
const LIB_ROOT = path.join(ROOT, 'content', 'libraries')
const DRY_RUN = process.argv.includes('--dry-run')

async function exists(p) {
  try { await fs.access(p); return true } catch { return false }
}

function isAlreadyPrefixed(dirName, id) {
  return dirName.startsWith(id + '-')
}

async function processFolder(dirName) {
  const fullDir = path.join(LIB_ROOT, dirName)
  const stat = await fs.stat(fullDir).catch(() => null)
  if (!stat || !stat.isDirectory()) return { dirName, skipped: true, reason: 'not-a-directory' }

  const indexPath = path.join(fullDir, 'index.md')
  if (!(await exists(indexPath))) {
    return { dirName, skipped: true, reason: 'missing-index.md' }
  }

  let fm
  try {
    const raw = await fs.readFile(indexPath, 'utf8')
    fm = matter(raw)
  } catch (e) {
    return { dirName, skipped: true, reason: 'parse-error', error: e.message }
  }
  const libraryId = (fm.data.library_id || '').toString().trim()
  if (!libraryId) {
    return { dirName, skipped: true, reason: 'no-library_id' }
  }
  if (!/^[0-9A-Za-z_-]+$/.test(libraryId)) {
    return { dirName, skipped: true, reason: 'invalid-library_id', value: libraryId }
  }
  if (isAlreadyPrefixed(dirName, libraryId)) {
    return { dirName, skipped: true, reason: 'already-prefixed', libraryId }
  }
  const targetName = `${libraryId}-${dirName}`
  const targetPath = path.join(LIB_ROOT, targetName)
  if (await exists(targetPath)) {
    return { dirName, skipped: true, reason: 'target-exists', targetName }
  }

  if (DRY_RUN) {
    return { dirName, libraryId, targetName, renamed: false, dryRun: true }
  }

  try {
    await fs.rename(fullDir, targetPath)
    return { dirName, libraryId, targetName, renamed: true }
  } catch (e) {
    return { dirName, libraryId, targetName, renamed: false, error: e.message }
  }
}

async function main() {
  if (!(await exists(LIB_ROOT))) {
    console.error('Libraries directory not found:', LIB_ROOT)
    process.exit(1)
  }
  const entries = await fs.readdir(LIB_ROOT)
  const results = []
  for (const entry of entries) {
    // Skip hidden/system folders
    if (entry.startsWith('.')) continue
    results.push(await processFolder(entry))
  }

  const summary = {
    total: results.length,
    renamed: results.filter(r => r.renamed).length,
    skipped: results.filter(r => r.skipped || (!r.renamed && !r.dryRun)).length,
    dryRunChanges: results.filter(r => r.dryRun).length
  }

  for (const r of results) {
    if (r.renamed) {
      console.log(`RENAMED  ${r.dirName} -> ${r.targetName}`)
    } else if (r.dryRun) {
      console.log(`DRY-RUN  ${r.dirName} -> ${r.targetName}`)
    } else if (r.skipped) {
      console.log(`SKIP     ${r.dirName} (${r.reason})`)
    } else if (r.error) {
      console.log(`ERROR    ${r.dirName}: ${r.error}`)
    }
  }

  console.log('\nSummary:', summary)
  if (DRY_RUN) {
    console.log('\n(Re-run without --dry-run to apply)')
  } else {
    console.log('\nNOTE: Update any routes/links if they referenced old folder slugs.')
  }
}

main().catch(e => { console.error(e); process.exit(1) })
