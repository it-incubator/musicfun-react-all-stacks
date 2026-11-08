import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Pagination from "@mui/material/Pagination"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import { Link, useSearchParams } from "react-router"

import { EmptyState } from "@/common/components"
import { GLOBAL_TASKS_PAGE_SIZE, PUBLIC_BOARDS_PAGE_SIZE } from "@/common/constants"
import { Path } from "@/common/routing"
import type { JsonApiMeta } from "@/common/types"
import { useAuth } from "@/features/auth/lib/useAuth.ts"
import { useGetBoardsQuery } from "@/features/boards/api/boardsApi.ts"
import { BoardCard } from "@/features/boards/ui/BoardCard/BoardCard.tsx"
import { BoardsGridSkeleton } from "@/features/boards/ui/BoardsGridSkeleton/BoardsGridSkeleton.tsx"
import { boardsGridSx } from "@/features/boards/ui/SortableBoardsGrid/SortableBoardsGrid.tsx"
import { useGetGlobalTasksQuery } from "@/features/tasks/api/tasksApi.ts"
import { GlobalTasksList } from "@/features/tasks/ui/GlobalTasksList/GlobalTasksList.tsx"

type ExploreTab = "boards" | "tasks"

export const ExplorePage = () => {
  const { isAuthed } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: ExploreTab = searchParams.get("tab") === "tasks" ? "tasks" : "boards"
  const page = Math.max(1, Number(searchParams.get("page")) || 1)

  const changeTab = (value: ExploreTab) => setSearchParams(value === "boards" ? {} : { tab: value })
  const changePage = (value: number) => {
    const params: Record<string, string> = { page: String(value) }
    if (tab === "tasks") params.tab = tab
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-end" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Explore
          </Typography>
          <Typography color="text.secondary">Public boards and the latest tasks from the whole community</Typography>
        </Box>
        <Button variant="contained" component={Link} to={isAuthed ? Path.MyBoards : Path.Login} size="large">
          {isAuthed ? "Go to my boards" : "Sign in to create boards"}
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, value) => changeTab(value)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="boards" label="Boards" />
        <Tab value="tasks" label="Latest tasks" />
      </Tabs>

      {tab === "boards" ? (
        <PublicBoards page={page} onPageChange={changePage} />
      ) : (
        <LatestTasks page={page} onPageChange={changePage} />
      )}
    </Container>
  )
}

type ListProps = {
  page: number
  onPageChange: (page: number) => void
}

const PublicBoards = ({ page, onPageChange }: ListProps) => {
  const { data, isLoading, isFetching } = useGetBoardsQuery({ pageNumber: page, pageSize: PUBLIC_BOARDS_PAGE_SIZE })

  if (isLoading) return <BoardsGridSkeleton count={PUBLIC_BOARDS_PAGE_SIZE} />

  if (!data?.data.length) {
    return (
      <EmptyState
        icon={<DashboardCustomizeOutlinedIcon />}
        title="No boards yet"
        description="Be the first to create one!"
      />
    )
  }

  return (
    <>
      <Box
        sx={{ ...boardsGridSx, opacity: isFetching ? 0.6 : 1, transition: "opacity .2s" }}
        data-testid="public-boards"
      >
        {data.data.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </Box>
      <ListPagination meta={data.meta} page={page} onPageChange={onPageChange} unit="boards" />
    </>
  )
}

const LatestTasks = ({ page, onPageChange }: ListProps) => {
  const { data, isLoading, isFetching } = useGetGlobalTasksQuery({ pageNumber: page, pageSize: GLOBAL_TASKS_PAGE_SIZE })

  if (!isLoading && !data?.data.length) {
    return <EmptyState icon={<DashboardCustomizeOutlinedIcon />} title="No tasks yet" />
  }

  return (
    <Box sx={{ opacity: isFetching && !isLoading ? 0.6 : 1, transition: "opacity .2s" }}>
      <GlobalTasksList data={data} isLoading={isLoading} />
      {data && <ListPagination meta={data.meta} page={page} onPageChange={onPageChange} unit="tasks" />}
    </Box>
  )
}

const ListPagination = ({ meta, page, onPageChange, unit }: ListProps & { meta: JsonApiMeta; unit: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mt: 4 }}>
    <Typography variant="body2" color="text.secondary">
      {meta.totalCount} {unit} total
    </Typography>
    {meta.pagesCount > 1 && (
      <Pagination
        count={meta.pagesCount}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        shape="rounded"
        color="primary"
      />
    )}
  </Box>
)
