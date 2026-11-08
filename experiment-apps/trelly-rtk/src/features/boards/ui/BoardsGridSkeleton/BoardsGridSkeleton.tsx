import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Skeleton from "@mui/material/Skeleton"

import { boardsGridSx } from "../SortableBoardsGrid/SortableBoardsGrid.tsx"

export const BoardsGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <Box sx={boardsGridSx} aria-busy="true" aria-label="Loading boards">
    {Array.from({ length: count }, (_, i) => (
      <Card key={i} sx={{ borderRadius: 3 }}>
        <Skeleton variant="rectangular" height={120} />
        <Box sx={{ p: 2 }}>
          <Skeleton width="70%" height={28} />
          <Skeleton width="90%" />
          <Skeleton width="40%" sx={{ mt: 2 }} />
        </Box>
      </Card>
    ))}
  </Box>
)
