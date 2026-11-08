import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useMemo } from "react"

import { selectThemeMode } from "@/app/model/app-slice.ts"
import { Header, Notifier } from "@/common/components"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { tokenStorage } from "@/features/auth/lib/tokens.ts"
import { useAuth } from "@/features/auth/lib/useAuth.ts"

import { Routing } from "./Routing.tsx"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = useMemo(() => getTheme(themeMode), [themeMode])

  const { isLoading } = useAuth()
  // anonymous visitors don't wait for /auth/me
  const isRestoringSession = isLoading && !!tokenStorage.getAccessToken()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isRestoringSession ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
          <CircularProgress size={56} thickness={3} />
        </Box>
      ) : (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routing />
          </Box>
          <Notifier />
        </Box>
      )}
    </ThemeProvider>
  )
}
