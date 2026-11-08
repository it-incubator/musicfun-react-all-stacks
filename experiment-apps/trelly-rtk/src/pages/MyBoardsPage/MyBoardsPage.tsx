import AddIcon from "@mui/icons-material/Add"
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import LinearProgress from "@mui/material/LinearProgress"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useState } from "react"

import { EmptyState } from "@/common/components"
import { LIMITS } from "@/common/constants"
import { useAuth } from "@/features/auth/lib/useAuth.ts"
import { useGetMyBoardsQuery } from "@/features/boards/api/boardsApi.ts"
import { BoardFormDialog } from "@/features/boards/ui/BoardFormDialog/BoardFormDialog.tsx"
import { BoardsGridSkeleton } from "@/features/boards/ui/BoardsGridSkeleton/BoardsGridSkeleton.tsx"
import { SortableBoardsGrid } from "@/features/boards/ui/SortableBoardsGrid/SortableBoardsGrid.tsx"

export const MyBoardsPage = () => {
  const { user } = useAuth()
  const { data, isLoading } = useGetMyBoardsQuery()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const boards = data?.data ?? []
  const isFull = boards.length >= LIMITS.boardsPerUser

  const createButton = (
    <Tooltip title={isFull ? `You can have at most ${LIMITS.boardsPerUser} boards` : ""}>
      <span>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateOpen(true)}
          disabled={isFull}
        >
          New board
        </Button>
      </span>
    </Tooltip>
  )

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "flex-end" },
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My boards
          </Typography>
          <Typography color="text.secondary">Hi, {user?.login}! Drag boards by the handle to reorder them.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!isLoading && (
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="caption" color="text.secondary" data-testid="boards-counter">
                {boards.length} / {LIMITS.boardsPerUser} boards
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(boards.length / LIMITS.boardsPerUser) * 100}
                sx={{ borderRadius: 2, height: 6, mt: 0.5 }}
                color={isFull ? "warning" : "primary"}
              />
            </Box>
          )}
          {createButton}
        </Box>
      </Box>

      {isLoading ? (
        <BoardsGridSkeleton count={4} />
      ) : boards.length ? (
        <SortableBoardsGrid boards={boards} />
      ) : (
        <EmptyState
          icon={<DashboardCustomizeOutlinedIcon />}
          title="Create your first board"
          description="Boards hold your tasks. Use one per project, sprint or idea."
          action={createButton}
        />
      )}

      <BoardFormDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </Container>
  )
}
