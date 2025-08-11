/**
 * Utility functions for library URL generation and parsing
 * New stable pattern: /library/{library_id}/{slug}
 * Backward compatibility supported for older /library/{id}-{slug} and /library/{slug}
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
    if (!id) throw new Error('Library must have library_id or id field')
    const paddedId = padLibraryId(id)
    const slug = library.slug
    return `/library/${paddedId}/${slug}`
}

/**
 * Parse library URL parameter to extract ID and slug
 * Supports both new format ({id}-{slug}) and legacy format ({slug})
 */
// Parse single-param legacy styles (kept for backward compatibility redirect logic)
export function parseLegacySingleParam(param: string): LibraryUrlParts | null {
    if (!param) return null
    const idSlugMatch = param.match(/^(\d{5,})-(.+)$/)
    if (idSlugMatch) {
        return { library_id: idSlugMatch[1], slug: param }
    }
    const idOnlyMatch = param.match(/^(\d{5,})$/)
    if (idOnlyMatch) return { library_id: idOnlyMatch[1], slug: param }
    if (!/^\d/.test(param)) return { library_id: '', slug: param }
    return null
}

// (Deprecated) Previously used for hyphen-joined ID-slug format
export function isNewUrlFormat(_param: string): boolean { return false }

/**
 * Check if a URL parameter is in the legacy slug-only format
 */
export function isLegacyUrlFormat(param: string): boolean {
    return !!/^[^-\d]/.test(param) && !/^\d/.test(param)
}

/**
 * Extract just the slug from a URL parameter (removes ID prefix if present)
 */
export function extractSlug(param: string): string {
    const parsed = parseLegacySingleParam(param)
    return parsed?.slug || param
}

/**
 * Extract just the library ID from a URL parameter
 */
export function extractLibraryId(param: string): string | null {
    const parsed = parseLegacySingleParam(param)
    return parsed?.library_id || null
}

/**
 * Create a canonical slug from a title (mirrors logic used in composables & page)
 */
export function slugFromTitle(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
}