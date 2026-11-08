import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import type { KeyboardEvent } from "react"

import { TaskStatus } from "@/common/enums"
import { pickImage } from "@/common/utils"

import { usePatchTaskMutation } from "../../api/tasksApi.ts"
import type { BoardTask } from "../../api/tasksApi.types.ts"
import { AttachmentsPill, DeadlinePill, PriorityPill, StatusPill } from "../TaskBadges/TaskBadges.tsx"

type Props = {
  task: BoardTask
  boardId: string
  isOwner: boolean
  showStatus?: boolean
  isDragging?: boolean
  isOverlay?: boolean
  onOpen?: () => void
}

export const TaskCard = ({ task, boardId, isOwner, showStatus = true, isDragging, isOverlay, onOpen }: Props) => {
  const [patchTask] = usePatchTaskMutation()
  const { title, status, priority, deadline, attachments } = task.attributes

  const isCompleted = status === TaskStatus.Completed
  const coverImage = pickImage(attachments.find((a) => a.isImage)?.images, ["medium", "original"])

  // PATCH — only the status changes
  const toggleCompleted = () => {
    patchTask({
      boardId,
      taskId: task.id,
      attributes: { status: isCompleted ? TaskStatus.New : TaskStatus.Completed },
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") onOpen?.()
  }

  return (
    <Paper
      variant="outlined"
      role="button"
      tabIndex={0}
      aria-label={`Open task ${title}`}
      data-testid="task-card"
      data-task-id={task.id}
      data-status={status}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      sx={{
        overflow: "hidden",
        borderRadius: 2.5,
        cursor: isOwner ? "grab" : "pointer",
        userSelect: "none",
        transition: "box-shadow .15s, border-color .15s",
        opacity: isDragging ? 0.4 : 1,
        "&:hover": { borderColor: "primary.main", boxShadow: "0 4px 14px -6px rgba(15, 23, 42, 0.2)" },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
        ...(isOverlay && {
          cursor: "grabbing",
          boxShadow: "0 18px 36px -12px rgba(15, 23, 42, 0.45)",
          transform: "rotate(2deg)",
        }),
      }}
    >
      {coverImage && (
        <Box
          component="img"
          src={coverImage.url}
          alt=""
          draggable={false}
          sx={{ display: "block", width: "100%", height: 110, objectFit: "cover" }}
        />
      )}
      <Box sx={{ p: 1.5, display: "flex", gap: 1, alignItems: "flex-start" }}>
        {isOwner && (
          <Checkbox
            checked={isCompleted}
            onChange={toggleCompleted}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon />}
            color="success"
            size="small"
            sx={{ p: 0.25, mt: "-1px" }}
            inputProps={{ "aria-label": isCompleted ? `Mark ${title} as not completed` : `Complete ${title}` }}
          />
        )}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 500,
              lineHeight: 1.4,
              wordBreak: "break-word",
              textDecoration: isCompleted ? "line-through" : "none",
              color: isCompleted ? "text.secondary" : "text.primary",
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
            {showStatus && <StatusPill status={status} />}
            <PriorityPill priority={priority} />
            {deadline && <DeadlinePill deadline={deadline} isDone={isCompleted} />}
            {attachments.length > 0 && <AttachmentsPill count={attachments.length} />}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
