import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined"
import LogoutIcon from "@mui/icons-material/Logout"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"

import { Path } from "@/common/routing"

import { useLogoutMutation } from "../../api/authApi.ts"
import { useAuth } from "../../lib/useAuth.ts"

export const UserMenu = () => {
  const { user } = useAuth()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const location = useLocation()

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  if (!user) {
    if (location.pathname === Path.Login) return null
    const redirect = `?redirect=${encodeURIComponent(location.pathname)}`
    return (
      <Button variant="contained" component={Link} to={`${Path.Login}${redirect}`}>
        Sign in
      </Button>
    )
  }

  const closeMenu = () => setAnchorEl(null)

  const logoutHandler = async () => {
    closeMenu()
    await logout()
    navigate(Path.Main)
  }

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Account menu" sx={{ p: 0.5 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 15, fontWeight: 700 }}>
          {user.login.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1, border: 1, borderColor: "divider" } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Signed in as
          </Typography>
          <Typography fontWeight={700} data-testid="current-user">
            {user.login}
          </Typography>
        </Box>
        <Divider />
        <MenuItem component={Link} to={Path.MyBoards} onClick={closeMenu}>
          <ListItemIcon>
            <DashboardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          My boards
        </MenuItem>
        <MenuItem onClick={logoutHandler}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  )
}
