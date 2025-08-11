/**
 * Library manifest generator for build-time ID ↔ slug mapping
 * Generates JSON manifest for runtime lookups and redirects
 */

import { readdir, stat, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export interface LibraryManifestEntry {
    library_id: string
    slug: string
    title: string
    folder: string
}

export interface LibraryManifest {
    libraries: LibraryManifestEntry[]
    idToSlug: Record<string, string>
    slugToId: Record<string, string>
    slugToTitle: Record<string, string>
    folderSlugMap?: Record<string, string> // folder -> slug mapping
}

/**
 * Build library manifest from content directory
 */
export async function buildLibraryManifest(librariesDir: string = 'content/libraries'): Promise<LibraryManifest> {
    const libraries: LibraryManifestEntry[] = []
    const idToSlug: Record<string, string> = {}
    const slugToId: Record<string, string> = {}
    const slugToTitle: Record<string, string> = {}

    try {
        const dirs = await readdir(librariesDir)
        
        for (const dir of dirs) {
            if (dir.startsWith('.')) continue
            
            const indexPath = path.join(librariesDir, dir, 'index.md')
            
            try {
                const stats = await stat(indexPath)
                if (!stats.isFile()) continue
                
                const content = await readFile(indexPath, 'utf8')
                const frontmatter = matter(content)
                
                                const libraryId = frontmatter.data.library_id
                                const title = frontmatter.data.title || dir
                                const titleSlug = title.toLowerCase()
                                    .normalize('NFKD')
                                    .replace(/[^a-z0-9]+/g, '-')
                                    .replace(/^-+|-+$/g, '')
                                    .replace(/-{2,}/g, '-') || dir
                
                if (!libraryId) {
                    console.warn(`Library ${dir} missing library_id, skipping`)
                    continue
                }
                
                const entry: LibraryManifestEntry = {
                    library_id: String(libraryId),
                    slug: titleSlug,
                    title,
                    folder: dir
                }
                
                libraries.push(entry)
                idToSlug[String(libraryId)] = titleSlug
                slugToId[titleSlug] = String(libraryId)
                slugToTitle[titleSlug] = title
                
            } catch (error) {
                console.warn(`Error processing ${dir}:`, error)
                continue
            }
        }
        
    } catch (error) {
        console.error('Error reading libraries directory:', error)
    }

    // Sort by library_id for consistent output
    libraries.sort((a, b) => a.library_id.localeCompare(b.library_id))

    return {
        libraries,
        idToSlug,
        slugToId,
    slugToTitle,
    folderSlugMap: Object.fromEntries(libraries.map(l => [l.folder, l.slug]))
    }
}

/**
 * Generate library manifest and return as JSON string
 */
export async function generateLibraryManifestJson(librariesDir?: string): Promise<string> {
    const manifest = await buildLibraryManifest(librariesDir)
    return JSON.stringify(manifest, null, 2)
}