// src/shared/utils/jwtUtils.ts

/**
 * Распарсить payload JWT и вернуть поле exp
 * @throws Error если формат токена некорректен или нет поля exp
 */
function parseJwtExp(token: string): number {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format')
  }

  // Декодируем payload (в middle-segment)
  const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8')
  const payload = JSON.parse(payloadJson)

  if (typeof payload.exp !== 'number') {
    throw new Error('JWT payload missing exp claim')
  }

  return payload.exp
}

/**
 * Возвращает, сколько секунд осталось до истечения токена
 */
export function getSecondsToExpiration(token: string): number {
  const exp = parseJwtExp(token)
  const now = Math.floor(Date.now() / 1000)
  return exp - now
}

/**
 * Возвращает maxAge для установки в cookie, основанный на exp токена
 * @throws Error если токен уже истёк или exp–now ≤ 0
 */
export function getJwtExpirationMaxAge(token: string): number {
  const seconds = getSecondsToExpiration(token)
  if (seconds <= 0) {
    throw new Error('Token already expired')
  }
  return seconds
}
