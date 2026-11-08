import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link } from "react-router"

import { Path } from "@/common/routing"

type Props = {
  size?: "small" | "large"
}

export const Logo = ({ size = "small" }: Props) => {
  const box = size === "large" ? 44 : 30

  return (
    <Box
      component={Link}
      to={Path.Main}
      aria-label="Trelly home"
      sx={{ display: "inline-flex", alignItems: "center", gap: 1.25, color: "text.primary", textDecoration: "none" }}
    >
      <Box
        sx={{
          width: box,
          height: box,
          borderRadius: size === "large" ? 3 : 2,
          background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3px",
          p: size === "large" ? "9px" : "6px",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
        }}
      >
        <Box sx={{ bgcolor: "rgba(255,255,255,0.95)", borderRadius: "3px" }} />
        <Box sx={{ bgcolor: "rgba(255,255,255,0.95)", borderRadius: "3px", height: "65%" }} />
      </Box>
      <Typography
        component="span"
        sx={{
          fontWeight: 800,
          fontSize: size === "large" ? 30 : 20,
          letterSpacing: "-0.03em",
          // the header is tight on phones: keep only the mark there
          display: size === "small" ? { xs: "none", sm: "inline" } : "inline",
        }}
      >
        Trelly
      </Typography>
    </Box>
  )
}
