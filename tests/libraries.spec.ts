import { describe, it, expect } from 'vitest'
import { buildDescription, mapContentDocToSummary } from '../composables/useLibraries'

describe('useLibraries helpers', () => {
  it('buildDescription returns empty string for missing body', () => {
    expect(buildDescription(undefined)).toBe('')
  })

  it('buildDescription extracts first paragraph text', () => {
    const body = {
      children: [
        { type: 'element', tag: 'p', children: [{ value: 'First paragraph text' }] },
        { type: 'element', tag: 'p', children: [{ value: 'Second paragraph' }] }
      ]
    }
    expect(buildDescription(body)).toContain('First paragraph text')
  })

  it('mapContentDocToSummary maps essential fields', () => {
    const doc = {
      _path: '/libraries/example-slug',
      title: 'Example',
      location: { lat: 1, lng: 2 },
      photo: '/x.jpg',
      tags: ['a'],
      body: { children: [{ type: 'element', tag: 'p', children: [{ value: 'Hello world' }] }] }
    }
    const summary = mapContentDocToSummary(doc)
  // Title-based slug takes precedence over folder slug; 'Example' -> 'example'
  expect(summary.slug).toBe('example')
    expect(summary.title).toBe('Example')
    expect(summary.description.length).toBeGreaterThan(0)
  })
})
