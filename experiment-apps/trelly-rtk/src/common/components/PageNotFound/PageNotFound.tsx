import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { Link } from "react-router"

import { Path } from "@/common/routing"

type Props = {
  title?: string
  description?: string
}

export const PageNotFound = ({
  title = "Page not found",
  description = "The page you are looking for doesn’t exist or has been moved.",
}: Props) => (
  <Container maxWidth="sm" sx={{ textAlign: "center", py: { xs: 8, md: 14 } }}>
    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: 96, md: 140 },
        background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      404
    </Typography>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>
      {description}
    </Typography>
    <Button variant="contained" size="large" component={Link} to={Path.Main}>
      Back to Explore
    </Button>
  </Container>
)
