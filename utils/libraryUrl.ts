/**
 * Utility functions for library URL generation and parsing
 * Supports the new stable ID-prefixed URL pattern: /library/{library_id}-{slug}
 */

export interface LibraryUrlParts {
    library_id: string
    slug?: string
}

export interface LibraryInfo {
    library_id?: string | number
    slug: string
    id?: string | number // Alternative field name
}

/**
 * Pad library ID to 5 digits with leading zeros
 */
export function padLibraryId(id: number | string): string {
    return String(Number(id)).padStart(5, '0')
}

/**
 * Generate canonical library URL with ID-slug pattern
 */
export function libraryUrl(library: LibraryInfo): string {
    const id = library.library_id ?? library.id
    if (!id) {
        throw new Error('Library must have library_id or id field')
    }
    const paddedId = padLibraryId(id)
    return `/library/${paddedId}-${library.slug}`
}

/**
 * Parse library URL parameter to extract ID and slug
 * Supports both new format ({id}-{slug}) and legacy format ({slug})
 */
export function parseLibraryUrl(param: string): LibraryUrlParts | null {
    if (!param) return null
    
    // Try new format first: {library_id}-{slug}
    const idSlugMatch = param.match(/^(\d{5,})(?:-(.+))?$/)
    if (idSlugMatch) {
        return {
            library_id: idSlugMatch[1],
            slug: idSlugMatch[2]
        }
    }
    
    // Legacy format: just slug (no numeric prefix)
    if (!/^\d/.test(param)) {
        return {
            library_id: '',
            slug: param
        }
    }
    
    return null
}

/**
 * Check if a URL parameter is in the new ID-slug format
 */
export function isNewUrlFormat(param: string): boolean {
    return /^\d{5,}-/.test(param)
}

/**
 * Check if a URL parameter is in the legacy slug-only format
 */
export function isLegacyUrlFormat(param: string): boolean {
    return !!/^[^-\d]/.test(param) || (!/^\d/.test(param) && !param.includes('-'))
}

/**
 * Extract just the slug from a URL parameter (removes ID prefix if present)
 */
export function extractSlug(param: string): string {
    const parsed = parseLibraryUrl(param)
    return parsed?.slug || param
}

/**
 * Extract just the library ID from a URL parameter
 */
export function extractLibraryId(param: string): string | null {
    const parsed = parseLibraryUrl(param)
    return parsed?.library_id || null
}