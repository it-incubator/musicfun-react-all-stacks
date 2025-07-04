import { useEffect } from 'react'

export const OAuthCallback = () => {
  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code') // или code/state, если flow другой

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*') // Лучше заменить "*" на точный origin
    }

    window.close()
  }, [])

  return <p>Logging you in...</p>
}
