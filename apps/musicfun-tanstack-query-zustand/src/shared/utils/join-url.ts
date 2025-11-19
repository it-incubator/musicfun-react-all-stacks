export function joinUrl(...parts: Array<string | number | null | undefined>): string {
  const segments = parts.map((p) => {
    // Replace null, undefined, or empty string with marker
    if (p === null || p === undefined || String(p).trim().length === 0) {
      return '__CHECK_SEGMENT_VALUE__'
    }
    return String(p)
  })

  if (segments.length === 0) return ''

  const cleaned = segments.map((segment, index) => {
    if (index === 0) {
      // first: trim only trailing slashes
      return segment.replace(/\/+$/g, '')
    }
    if (index === segments.length - 1) {
      // last: trim both leading and trailing slashes
      return segment.replace(/^\/+|\/+$/g, '')
    }
    // middle: trim both sides
    return segment.replace(/^\/+|\/+$/g, '')
  })

  return cleaned.join('/')
}

// Примеры:
// joinUrl('https://example.com/', '/api/', '/v1/', 'users/') -> 'https://example.com/api/v1/users'
// joinUrl('/api', 'users', 123) -> '/api/users/123'
// joinUrl('/api', null, undefined, 'users') -> '/api/__CHECK_SEGMENT_VALUE__/__CHECK_SEGMENT_VALUE__/users'
// joinUrl('', '/api/', '', 'users/') -> '__CHECK_SEGMENT_VALUE__/api/__CHECK_SEGMENT_VALUE__/users'
