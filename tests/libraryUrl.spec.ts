import { describe, it, expect } from 'vitest'
import { 
    padLibraryId, 
    libraryUrl, 
    parseLibraryUrl, 
    isNewUrlFormat, 
    isLegacyUrlFormat,
    extractSlug,
    extractLibraryId
} from '../utils/libraryUrl'

describe('libraryUrl utilities', () => {
    describe('padLibraryId', () => {
        it('pads numbers to 5 digits', () => {
            expect(padLibraryId(1)).toBe('00001')
            expect(padLibraryId(73)).toBe('00073')
            expect(padLibraryId(12345)).toBe('12345')
        })

        it('handles string input', () => {
            expect(padLibraryId('1')).toBe('00001')
            expect(padLibraryId('00073')).toBe('00073')
        })

        it('handles large numbers', () => {
            expect(padLibraryId(123456)).toBe('123456')
        })
    })

    describe('libraryUrl', () => {
        it('generates URL with library_id field for existing format', () => {
            const library = { library_id: 73, slug: '00073-example-library' }
            expect(libraryUrl(library)).toBe('/library/00073-example-library')
        })

        it('generates URL with library_id field for new slug', () => {
            const library = { library_id: 73, slug: 'example-library' }
            expect(libraryUrl(library)).toBe('/library/00073-example-library')
        })

        it('generates URL with id field as fallback', () => {
            const library = { id: 1, slug: 'first-library' }
            expect(libraryUrl(library)).toBe('/library/00001-first-library')
        })

        it('prefers library_id over id', () => {
            const library = { library_id: 73, id: 999, slug: 'example' }
            expect(libraryUrl(library)).toBe('/library/00073-example')
        })

        it('throws error if no ID provided', () => {
            const library = { slug: 'no-id' }
            expect(() => libraryUrl(library)).toThrow('Library must have library_id or id field')
        })

        it('handles string IDs', () => {
            const library = { library_id: '00042', slug: 'string-id' }
            expect(libraryUrl(library)).toBe('/library/00042-string-id')
        })
    })

    describe('parseLibraryUrl', () => {
        it('parses new format with ID and slug', () => {
            const result = parseLibraryUrl('00073-example-library')
            expect(result).toEqual({
                library_id: '00073',
                slug: '00073-example-library'
            })
        })

        it('parses existing directory format', () => {
            const result = parseLibraryUrl('00001-1005-jervis-st-at-nelson-st-sw')
            expect(result).toEqual({
                library_id: '00001',
                slug: '00001-1005-jervis-st-at-nelson-st-sw'
            })
        })

        it('parses new format with ID only', () => {
            const result = parseLibraryUrl('00073')
            expect(result).toEqual({
                library_id: '00073',
                slug: '00073'
            })
        })

        it('parses legacy format (slug only)', () => {
            const result = parseLibraryUrl('example-library-slug')
            expect(result).toEqual({
                library_id: '',
                slug: 'example-library-slug'
            })
        })

        it('handles empty/null input', () => {
            expect(parseLibraryUrl('')).toBeNull()
            expect(parseLibraryUrl(null as any)).toBeNull()
        })

        it('handles numeric IDs with varying lengths', () => {
            expect(parseLibraryUrl('12345-slug')).toEqual({
                library_id: '12345',
                slug: '12345-slug'
            })
            expect(parseLibraryUrl('123456789-slug')).toEqual({
                library_id: '123456789',
                slug: '123456789-slug'
            })
        })
    })

    describe('isNewUrlFormat', () => {
        it('recognizes new format', () => {
            expect(isNewUrlFormat('00073-example')).toBe(true)
            expect(isNewUrlFormat('12345-library')).toBe(true)
            expect(isNewUrlFormat('00001-')).toBe(true)
        })

        it('rejects legacy format', () => {
            expect(isNewUrlFormat('example-library')).toBe(false)
            expect(isNewUrlFormat('library-name')).toBe(false)
            expect(isNewUrlFormat('1-short-id')).toBe(false) // Less than 5 digits
        })
    })

    describe('isLegacyUrlFormat', () => {
        it('recognizes legacy format', () => {
            expect(isLegacyUrlFormat('example-library')).toBe(true)
            expect(isLegacyUrlFormat('library-name')).toBe(true)
            expect(isLegacyUrlFormat('simple')).toBe(true)
        })

        it('rejects new format', () => {
            expect(isLegacyUrlFormat('00073-example')).toBe(false)
            expect(isLegacyUrlFormat('12345-library')).toBe(false)
        })
    })

    describe('extractSlug', () => {
        it('extracts slug from new format', () => {
            expect(extractSlug('00073-example-library')).toBe('00073-example-library')
        })

        it('returns full param for legacy format', () => {
            expect(extractSlug('example-library')).toBe('example-library')
        })

        it('handles ID-only format', () => {
            expect(extractSlug('00073')).toBe('00073')
        })
    })

    describe('extractLibraryId', () => {
        it('extracts ID from new format', () => {
            expect(extractLibraryId('00073-example')).toBe('00073')
        })

        it('returns null for legacy format', () => {
            expect(extractLibraryId('example-library')).toBeNull()
        })

        it('extracts ID from ID-only format', () => {
            expect(extractLibraryId('00073')).toBe('00073')
        })
    })
})