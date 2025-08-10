#!/usr/bin/env node
/**
 * Temp script: Normalize library markdown files.
 * Target files: content/libraries/(each library folder)/index.md
 *
 * Actions per file:
 * 1. Remove sections (and their content) beginning with the exact headings:
 *      ## Location Details
 *      ## Photos
 *      ## Import Information
 * 2. Remove any existing '## History' section (we'll rewrite it cleanly).
 * 3. Append a new '## History' section with a standard initial entry:
 *
 *    ## History\n
 *    - **2025-Aug-08** - Imported from Vancouver Little Libraries 2025.8.6.revision\n
 * Notes:
 * - Only processes markdown files that have frontmatter and keeps frontmatter untouched.
 * - Uses a very lightweight parser (line-based) to strip sections until the next heading of same or higher level (## ...).
 * - Idempotent: re-running yields no further changes after first application.
 * - Supports --dry-run to preview changes.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const DRY_RUN = process.argv.includes('--dry-run')
const ROOT = process.cwd()
const LIB_ROOT = path.join(ROOT, 'content', 'libraries')

const REMOVE_HEADINGS = new Set([
  '## Location Details',
  '## Photos',
  '## Import Information',
  '## History' // remove existing so we can re-add cleanly
])

const HISTORY_SECTION = [
  '## History',
  '- **2025-Aug-08** - Imported from Vancouver Little Libraries 2025.8.6.revision',
  ''
].join('\n')

async function exists(p) { try { await fs.access(p); return true } catch { return false } }

async function processFile(filePath) {
  const original = await fs.readFile(filePath, 'utf8')
  const parsed = matter(original)
  const body = parsed.content || ''

  const lines = body.split(/\r?\n/)
  const kept = []
  let skipping = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^##\s+/.test(line.trim())) {
      // New level-2 heading -> decide if we skip this section
      if (REMOVE_HEADINGS.has(line.trim())) {
        skipping = true
        continue // drop the heading line itself
      } else {
        skipping = false
      }
    }
    if (!skipping) kept.push(line)
  }

  // Trim trailing empty lines
  while (kept.length && kept[kept.length - 1].trim() === '') kept.pop()

  // Ensure a blank line before History if body not empty
  if (kept.length) kept.push('')
  kept.push(HISTORY_SECTION)

  const newBody = kept.join('\n').replace(/\n{3,}/g, '\n\n')
  const output = matter.stringify(newBody, parsed.data)

  if (output === original) {
    return { filePath, changed: false }
  }
  if (DRY_RUN) {
    return { filePath, changed: false, dryRun: true, preview: diffStat(original, output) }
  }
  await fs.writeFile(filePath, output, 'utf8')
  return { filePath, changed: true }
}

function diffStat(a, b) {
  const aLines = a.split(/\r?\n/).length
  const bLines = b.split(/\r?\n/).length
  const delta = bLines - aLines
  return `${aLines} -> ${bLines} lines (${delta >= 0 ? '+' + delta : delta})`
}

async function main() {
  if (!(await exists(LIB_ROOT))) {
    console.error('Libraries directory not found:', LIB_ROOT)
    process.exit(1)
  }
  const dirs = (await fs.readdir(LIB_ROOT)).filter(d => !d.startsWith('.'))
  const targets = []
  for (const d of dirs) {
    const fp = path.join(LIB_ROOT, d, 'index.md')
    if (await exists(fp)) targets.push(fp)
  }

  if (!targets.length) {
    console.log('No index.md files found.')
    return
  }
  console.log(`Processing ${targets.length} markdown file(s)...`)    
  const results = []
  for (const f of targets) {
    try {
      results.push(await processFile(f))
    } catch (e) {
      results.push({ filePath: f, error: e.message })
    }
  }

  for (const r of results) {
    if (r.error) {
      console.log(`ERROR    ${r.filePath}: ${r.error}`)
    } else if (r.dryRun) {
      console.log(`DRY-RUN  ${r.filePath} (${r.preview})`)
    } else if (r.changed) {
      console.log(`UPDATED  ${r.filePath}`)
    } else {
      console.log(`NO-OP    ${r.filePath}`)
    }
  }

  const summary = {
    total: results.length,
    updated: results.filter(r => r.changed).length,
    dryRun: results.filter(r => r.dryRun).length,
    noOp: results.filter(r => !r.changed && !r.dryRun && !r.error).length,
    errors: results.filter(r => r.error).length
  }
  console.log('\nSummary:', summary)
  if (DRY_RUN) console.log('\n(Re-run without --dry-run to apply)')
}

main().catch(e => { console.error(e); process.exit(1) })
