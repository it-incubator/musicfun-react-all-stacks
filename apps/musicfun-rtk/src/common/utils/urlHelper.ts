export const joinUrl = (...parts: (string | number | undefined | null)[]): string => {
  return parts
    .filter(Boolean) // Remove undefined / null / ''
    .map((p, i) =>
      i === 0
        ? String(p).replace(/\/+$/, '') // Remove trailing from first
        : String(p).replace(/^\/+|\/+$/g, ''),
    )
    .join('/')
}
