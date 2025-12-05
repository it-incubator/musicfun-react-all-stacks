// joinUrl.test.ts
import { describe, expect, it } from 'vitest'

import { joinUrl } from './join-url'

describe('joinUrl', () => {
  it('joins simple segments', () => {
    expect(joinUrl('api', 'users')).toBe('api/users')
  })

  it('keeps protocol and host correctly', () => {
    expect(joinUrl('https://example.com', 'api', 'v1', 'users')).toBe(
      'https://example.com/api/v1/users'
    )
  })

  it('trims trailing slashes on first segment', () => {
    expect(joinUrl('https://example.com///', 'api', 'v1')).toBe('https://example.com/api/v1')
  })

  it('trims leading slashes on last segment', () => {
    expect(joinUrl('https://example.com', '/api', '/v1///')).toBe('https://example.com/api/v1')
  })

  it('trims both sides on middle segments', () => {
    expect(joinUrl('https://example.com/', '/api/', '/v1/', '/users/')).toBe(
      'https://example.com/api/v1/users'
    )
  })

  it('handles numeric segments', () => {
    expect(joinUrl('/api', 'users', 123)).toBe('/api/users/123')
  })

  it('replaces null and undefined with marker', () => {
    expect(joinUrl('/api', null, undefined, 'users')).toBe(
      '/api/__CHECK_SEGMENT_VALUE__/__CHECK_SEGMENT_VALUE__/users'
    )
  })

  it('replaces empty strings with marker', () => {
    expect(joinUrl('', '/api/', '', 'users/', '')).toBe(
      '__CHECK_SEGMENT_VALUE__/api/__CHECK_SEGMENT_VALUE__/users/__CHECK_SEGMENT_VALUE__'
    )
  })

  it('returns empty string for empty input', () => {
    expect(joinUrl()).toBe('')
  })

  it('works with root slash as first segment', () => {
    expect(joinUrl('/', 'api', 'users')).toBe('/api/users')
  })

  it('does not duplicate slashes after protocol with path having leading slash', () => {
    expect(joinUrl('https://example.com/', '/api', '/users')).toBe('https://example.com/api/users')
  })
})

// Есть и другие варианты организации тестов.
