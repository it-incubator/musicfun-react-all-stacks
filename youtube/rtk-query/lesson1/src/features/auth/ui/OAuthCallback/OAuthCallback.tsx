// Component triggered after successful OAuth authorization,
// its purpose is to send the code back to the main app window and close the popup
import { useEffect } from 'react'

export const OAuthCallback = () => {
  useEffect(() => {
    // Get the current URL
    const url = new URL(window.location.href)

    // Extract code from query parameters
    const code = url.searchParams.get('code')

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*')
    }

    window.close()
  }, [])

  return <p>Logging you in...</p>
}
