import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { ReactNode } from "react"

type Props = {
  icon: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
}

export const EmptyState = ({ icon, title, description, action }: Props) => (
  <Box
    sx={{
      textAlign: "center",
      py: { xs: 6, md: 10 },
      px: 3,
      border: 1,
      borderStyle: "dashed",
      borderColor: "divider",
      borderRadius: 4,
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        mx: "auto",
        mb: 2,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: "action.hover",
        color: "primary.main",
        "& svg": { fontSize: 32 },
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary" sx={{ maxWidth: 420, mx: "auto" }}>
        {description}
      </Typography>
    )}
    {action && <Box sx={{ mt: 3 }}>{action}</Box>}
  </Box>
)
