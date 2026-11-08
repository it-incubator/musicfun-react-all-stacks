import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import { NavLink } from "react-router"

import { changeThemeModeAC, selectIsMutating, selectThemeMode } from "@/app/model/app-slice.ts"
import { Logo } from "@/common/components/Logo/Logo"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Path } from "@/common/routing"
import { useAuth } from "@/features/auth/lib/useAuth.ts"
import { UserMenu } from "@/features/auth/ui/UserMenu/UserMenu.tsx"

const navButtonSx = {
  color: "text.secondary",
  px: { xs: 1, sm: 1.5 },
  minWidth: 0,
  whiteSpace: "nowrap",
  "&.active": { color: "primary.main", bgcolor: "action.selected" },
}

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const isMutating = useAppSelector(selectIsMutating)
  const { isAuthed } = useAuth()

  const dispatch = useAppDispatch()

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(14,17,23,0.8)" : "rgba(255,255,255,0.8)"),
        backdropFilter: "blur(12px)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: { xs: 1, sm: 3 }, minHeight: { xs: 60 } }}>
          <Logo />
          <Box component="nav" sx={{ display: "flex", gap: 0.5, flexGrow: 1 }}>
            <Button component={NavLink} to={Path.Main} end sx={navButtonSx}>
              Explore
            </Button>
            {isAuthed && (
              <Button component={NavLink} to={Path.MyBoards} sx={navButtonSx}>
                My boards
              </Button>
            )}
          </Box>
          <Tooltip title={themeMode === "light" ? "Dark mode" : "Light mode"}>
            <IconButton onClick={changeMode} aria-label="Toggle theme">
              {themeMode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
          <UserMenu />
        </Toolbar>
      </Container>
      {isMutating && (
        <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2 }} aria-label="Saving" />
      )}
    </AppBar>
  )
}
