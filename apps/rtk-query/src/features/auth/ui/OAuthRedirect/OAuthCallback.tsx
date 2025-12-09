import { useEffect } from 'react'

/**
 * OAuth callback handler component.
 * Retrieves the authorization code from the URL, sends it to the parent window, and closes the popup.
 * Used to complete OAuth authentication via a popup window.
 */
export const OAuthCallback = () => {
  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code') // or code/state if flow is different

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*') // better to use exact origin instead of *
    }

    window.close()
  }, [])

  return <p>Logging you in...</p>
}
