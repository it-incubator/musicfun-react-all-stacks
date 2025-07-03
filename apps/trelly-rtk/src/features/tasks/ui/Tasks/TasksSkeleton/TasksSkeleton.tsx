import { containerSx } from "@/common/styles"
import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"

export const TasksSkeleton = () => (
  <Box style={{ padding: "8px 0" }}>
    {Array(4)
      .fill(null)
      .map((_, id) => (
        <Box key={id} sx={containerSx}>
          <Box sx={containerSx} style={{ gap: "15px" }}>
            <Skeleton width={20} height={40} />
            <Skeleton width={150} height={40} />
          </Box>
          <Skeleton width={20} height={40} />
        </Box>
      ))}
  </Box>
)
