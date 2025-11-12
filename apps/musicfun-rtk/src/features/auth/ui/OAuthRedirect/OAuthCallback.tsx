import { useEffect } from 'react'

export const OAuthCallback = () => {
  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code') // Or code/state, if flow is different

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*') // Better to replace "*" with exact origin
    }

    window.close()
  }, [])

  return <p>Logging you in...</p>
}
