import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"

import { Path } from "@/common/routing"

import { useLoginMutation } from "../../api/authApi.ts"
import { buildOAuthLoginArgs, OAUTH_MESSAGE_TYPE, oauthSession } from "../../lib/oauth.ts"

export const OAuthCallback = () => {
  const navigate = useNavigate()
  const [login] = useLoginMutation()
  const [failed, setFailed] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const code = new URL(window.location.href).searchParams.get("code")
    if (!code) {
      setFailed(true)
      return
    }

    // Opened as a popup: hand the code to the main window
    if (window.opener) {
      window.opener.postMessage({ type: OAUTH_MESSAGE_TYPE, code }, window.location.origin)
      window.close()
      return
    }

    // Opened in the main window (popup was blocked): log in right here
    login(buildOAuthLoginArgs(code, oauthSession.pop()))
      .unwrap()
      .then(() => navigate(Path.MyBoards, { replace: true }))
      .catch(() => setFailed(true))
  }, [login, navigate])

  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh", textAlign: "center", p: 3 }}>
      {failed ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Could not sign you in
          </Typography>
          <Button variant="contained" component={Link} to={Path.Login}>
            Try again
          </Button>
        </Box>
      ) : (
        <Box>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography color="text.secondary">Signing you in…</Typography>
        </Box>
      )}
    </Box>
  )
}
