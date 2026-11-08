import AttachFileIcon from "@mui/icons-material/AttachFile"
import EventOutlinedIcon from "@mui/icons-material/EventOutlined"
import Box from "@mui/material/Box"
import { alpha } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import type { ReactNode } from "react"

import { TaskPriority, TaskStatus } from "@/common/enums"
import { formatDate, formatShortDate, isOverdue } from "@/common/utils"

import { PRIORITY_META, STATUS_META } from "../../lib/taskMeta.ts"

type PillProps = {
  color: string
  children: ReactNode
  dot?: boolean
  label?: string
}

export const Pill = ({ color, children, dot, label }: PillProps) => (
  <Box
    component="span"
    aria-label={label}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.6,
      px: 1,
      height: 22,
      borderRadius: 11,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1,
      whiteSpace: "nowrap",
      color,
      bgcolor: alpha(color, 0.14),
    }}
  >
    {dot && <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: color }} />}
    {children}
  </Box>
)

export const StatusPill = ({ status }: { status: TaskStatus }) => (
  <Pill color={STATUS_META[status].color} dot label={`Status: ${STATUS_META[status].label}`}>
    {STATUS_META[status].label}
  </Pill>
)

export const PriorityPill = ({ priority }: { priority: TaskPriority }) => (
  <Pill color={PRIORITY_META[priority].color} label={`Priority: ${PRIORITY_META[priority].label}`}>
    {PRIORITY_META[priority].label}
  </Pill>
)

export const DeadlinePill = ({ deadline, isDone }: { deadline: string; isDone: boolean }) => {
  const overdue = !isDone && isOverdue(deadline)
  return (
    <Tooltip title={`Deadline: ${formatDate(deadline)}${overdue ? " (overdue)" : ""}`}>
      <span>
        <Pill color={overdue ? "#EF4444" : "#64748B"}>
          <EventOutlinedIcon sx={{ fontSize: 14 }} />
          {formatShortDate(deadline)}
        </Pill>
      </span>
    </Tooltip>
  )
}

export const AttachmentsPill = ({ count }: { count: number }) => (
  <Pill color="#64748B" label={`${count} attachments`}>
    <AttachFileIcon sx={{ fontSize: 14, transform: "rotate(45deg)" }} />
    {count}
  </Pill>
)
