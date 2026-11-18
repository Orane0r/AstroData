import { describe, expect, it } from 'vitest'
import { isSlug, removeNumberPrefix, slugify } from '../../shared/utils/string'

/**
 * `slugify` builds the public identifier and `isSlug` validates it, so both
 * have to stay in sync (see the slug contract in AGENTS.md).
 */
describe('slugify', () => {
  it('lowercases and joins words with dashes', () => {
    expect(slugify('Earth')).toBe('earth')
    expect(slugify('Dwarf planet')).toBe('dwarf-planet')
  })

  it('strips diacritics', () => {
    expect(slugify('2867 Ŝteins')).toBe('2867-steins')
  })

  it('drops apostrophes and the okina instead of turning them into dashes', () => {
    expect(slugify('Hiʻiaka')).toBe('hiiaka')
  })

  it('collapses punctuation into single dashes', () => {
    expect(slugify('C/2019 Y4 (ATLAS)')).toBe('c-2019-y4-atlas')
  })

  it('returns an empty string when nothing is left', () => {
    expect(slugify('  ')).toBe('')
    expect(slugify('---')).toBe('')
  })
})

describe('isSlug', () => {
  it('accepts a canonical slug', () => {
    expect(isSlug('earth')).toBe(true)
    expect(isSlug('metis-moon')).toBe(true)
  })

  it('rejects anything `slugify` would rewrite', () => {
    expect(isSlug('Earth')).toBe(false)
    expect(isSlug('earth ')).toBe(false)
    expect(isSlug('earth-')).toBe(false)
  })

  it('rejects an empty value', () => {
    expect(isSlug('')).toBe(false)
  })

  it('accepts a numeric string, which is why a legacy id can only 404 on lookup', () => {
    expect(isSlug('42')).toBe(true)
  })
})

describe('removeNumberPrefix', () => {
  it('drops a leading number', () => {
    expect(removeNumberPrefix('2867 Steins')).toBe('Steins')
  })

  it('drops a leading parenthesised number', () => {
    expect(removeNumberPrefix('(123) Name')).toBe('Name')
  })

  it('leaves a value without a prefix untouched', () => {
    expect(removeNumberPrefix('Earth')).toBe('Earth')
  })
})
