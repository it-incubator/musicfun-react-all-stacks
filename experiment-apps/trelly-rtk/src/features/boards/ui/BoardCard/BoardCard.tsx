import StarIcon from "@mui/icons-material/Star"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import type { ReactNode } from "react"
import { Link } from "react-router"

import { boardPath } from "@/common/routing"
import { formatDate } from "@/common/utils"

import type { Board } from "../../api/boardsApi.types.ts"
import { BoardActions } from "../BoardActions/BoardActions.tsx"
import { BoardCover } from "../BoardCover/BoardCover.tsx"
import { ImportantToggle } from "../ImportantToggle/ImportantToggle.tsx"

type Props = {
  board: Board
  isOwner?: boolean
  isFirst?: boolean
  dragHandle?: ReactNode
  isDragging?: boolean
}

const overlayButtonSx = {
  bgcolor: "rgba(15, 23, 42, 0.55)",
  color: "#fff",
  backdropFilter: "blur(4px)",
  "&:hover": { bgcolor: "rgba(15, 23, 42, 0.75)" },
}

export const BoardCard = ({ board, isOwner, isFirst, dragHandle, isDragging }: Props) => {
  const { title, description, isImportant, addedAt } = board.attributes

  return (
    <Card
      data-testid="board-card"
      data-board-id={board.id}
      sx={{
        position: "relative",
        height: "100%",
        borderRadius: 3,
        transition: "box-shadow .2s, transform .2s, border-color .2s",
        "&:hover": { boxShadow: "0 10px 30px -12px rgba(15, 23, 42, 0.25)", borderColor: "primary.main" },
        "&:hover .board-card-overlay, &:focus-within .board-card-overlay": { opacity: 1 },
        ...(isDragging && { boxShadow: "0 20px 40px -12px rgba(15, 23, 42, 0.4)", transform: "rotate(1.5deg)" }),
      }}
    >
      <CardActionArea
        component={Link}
        to={boardPath(board.id)}
        sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <BoardCover board={board} height={120} preferred={["original", "medium"]} />
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3, wordBreak: "break-word" }}>
            {!isOwner && isImportant && (
              <StarIcon
                aria-label="Important"
                sx={{ fontSize: 16, color: "secondary.main", verticalAlign: "-2px", mr: 0.5 }}
              />
            )}
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {description}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ mt: "auto", pt: 1 }}>
            Created {formatDate(addedAt)}
          </Typography>
        </CardContent>
      </CardActionArea>

      {isOwner && (
        <>
          {dragHandle && <Box sx={{ position: "absolute", top: 8, left: 8 }}>{dragHandle}</Box>}
          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.75 }}>
            <ImportantToggle
              board={board}
              sx={{ ...overlayButtonSx, ...(isImportant && { bgcolor: "rgba(15, 23, 42, 0.7)" }) }}
            />
            <Box className="board-card-overlay" sx={{ opacity: { xs: 1, md: 0 }, transition: "opacity .15s" }}>
              <BoardActions board={board} isFirst={isFirst} buttonSx={overlayButtonSx} />
            </Box>
          </Box>
        </>
      )}
    </Card>
  )
}
