import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Paper from "@mui/material/Paper"
import Skeleton from "@mui/material/Skeleton"
import Typography from "@mui/material/Typography"
import { Link } from "react-router"

import { TaskStatus } from "@/common/enums"
import { taskPath } from "@/common/routing"
import { formatShortDate } from "@/common/utils"

import type { GetGlobalTasksResponse } from "../../api/tasksApi.types.ts"
import { AttachmentsPill, PriorityPill, StatusPill } from "../TaskBadges/TaskBadges.tsx"

type Props = {
  data?: GetGlobalTasksResponse
  isLoading: boolean
}

export const GlobalTasksList = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: "divider" }}>
            <Skeleton width="40%" />
            <Skeleton width="20%" />
          </Box>
        ))}
      </Paper>
    )
  }

  // JSON:API compound document: board titles come once per board in `included`
  const boardTitles = new Map(data?.included.map((board) => [board.id, board.attributes.title]))

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }} data-testid="global-tasks">
      {data?.data.map((task, index) => {
        const boardId = task.relationships.board.data.id
        const { title, status, priority, addedAt, attachmentsCount } = task.attributes
        return (
          <ButtonBase
            key={task.id}
            component={Link}
            to={taskPath(boardId, task.id)}
            data-testid="global-task"
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2.5,
              py: 1.75,
              textAlign: "left",
              borderTop: index ? 1 : 0,
              borderColor: "divider",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                fontWeight={600}
                noWrap
                sx={{
                  textDecoration: status === TaskStatus.Completed ? "line-through" : "none",
                  color: status === TaskStatus.Completed ? "text.secondary" : "text.primary",
                }}
              >
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {boardTitles.get(boardId) ?? "Unknown board"} · {formatShortDate(addedAt)}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 0.75, flexShrink: 0 }}>
              {attachmentsCount > 0 && <AttachmentsPill count={attachmentsCount} />}
              <PriorityPill priority={priority} />
              <StatusPill status={status} />
            </Box>
          </ButtonBase>
        )
      })}
    </Paper>
  )
}
