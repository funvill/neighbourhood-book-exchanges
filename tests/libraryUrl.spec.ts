import { describe, it, expect } from 'vitest'
import {
    padLibraryId,
    libraryUrl,
    parseLegacySingleParam,
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
            it('generates canonical /library/{id}/{slug}', () => {
                const library = { library_id: 73, slug: 'example-library' }
                expect(libraryUrl(library)).toBe('/library/00073/example-library/')
            })
            it('handles id fallback field', () => {
                const library = { id: 5, slug: 'test' }
                expect(libraryUrl(library)).toBe('/library/00005/test/')
            })
            it('pads numeric id', () => {
                const library = { library_id: 1, slug: 'x' }
                expect(libraryUrl(library)).toBe('/library/00001/x/')
            })
            it('accepts already padded string id', () => {
                const library = { library_id: '00042', slug: 'string-id' }
                expect(libraryUrl(library)).toBe('/library/00042/string-id/')
            })
                    it('throws when missing id', () => {
                        expect(() => libraryUrl({ slug: 'no-id' } as any)).toThrow()
                    })
        })

        describe('parseLegacySingleParam (backward compatibility)', () => {
            it('parses id-hyphen-slug legacy form', () => {
                expect(parseLegacySingleParam('00073-example-library')).toEqual({ library_id: '00073', slug: '00073-example-library' })
            })
            it('parses id only', () => {
                expect(parseLegacySingleParam('00073')).toEqual({ library_id: '00073', slug: '00073' })
            })
            it('parses pure slug (no leading digit)', () => {
                expect(parseLegacySingleParam('example-library')).toEqual({ library_id: '', slug: 'example-library' })
            })
            it('returns null for malformed value', () => {
                expect(parseLegacySingleParam('123-')).toBeNull()
            })
        })

        describe('isNewUrlFormat (deprecated always false)', () => {
            it('returns false for any input', () => {
                expect(isNewUrlFormat('00073-example')).toBe(false)
                expect(isNewUrlFormat('anything')).toBe(false)
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
                it('returns original param (function retained for compatibility)', () => {
                    expect(extractSlug('00073-example-library')).toBe('00073-example-library')
                    expect(extractSlug('example-library')).toBe('example-library')
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