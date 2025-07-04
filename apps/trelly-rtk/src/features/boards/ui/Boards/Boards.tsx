import { containerSx } from "@/common/styles"
import { useGetBoardsQuery } from "@/features/boards/api/boardsApi.ts"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { BoardItem } from "@/features/boards/ui/Boards/BoardItem/BoardItem.tsx"
import { BoardSkeleton } from "@/features/boards/ui/Boards/BoardSkeleton/BoardSkeleton.tsx"

export const Boards = () => {
  const { data, isLoading } = useGetBoardsQuery()

  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <BoardSkeleton key={id} />
          ))}
      </Box>
    )
  }

  return (
    <>
      {data?.data.map((board) => (
        <Grid key={board.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <BoardItem board={board} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
