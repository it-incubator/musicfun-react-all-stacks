export const makeFullUrl = (base?: string, path?: string): string => {
  const b = (base || '').replace(/\/+$/, '')
  const p = (path || '').replace(/^\/+/, '')
  if (!b && !p) return ''
  if (!b) return '/' + p
  if (!p) return b
  return `${b}/${p}`
}
