import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { type KeyboardEvent, useState } from "react"

import { LIMITS } from "@/common/constants"

type TitleProps = {
  value: string
  editable: boolean
  onSave: (value: string) => void
}

/** Click to edit; Enter or blur saves, Escape cancels */
export const InlineTitle = ({ value, editable, onSave }: TitleProps) => {
  const [draft, setDraft] = useState<string | null>(null)

  const save = () => {
    const trimmed = draft?.trim()
    if (trimmed && trimmed !== value) onSave(trimmed)
    setDraft(null)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      save()
    }
    if (e.key === "Escape") {
      e.stopPropagation()
      setDraft(null)
    }
  }

  if (draft !== null) {
    return (
      <TextField
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        autoFocus
        fullWidth
        size="small"
        slotProps={{ htmlInput: { maxLength: LIMITS.titleMaxLength, "aria-label": "Task title" } }}
        sx={{ "& input": { fontSize: 20, fontWeight: 700 } }}
      />
    )
  }

  return (
    <Typography
      variant="h6"
      component="h2"
      data-testid="task-title"
      onClick={editable ? () => setDraft(value) : undefined}
      title={editable ? "Click to edit" : undefined}
      sx={{
        fontSize: 20,
        lineHeight: 1.35,
        wordBreak: "break-word",
        borderRadius: 1,
        px: 0.5,
        mx: -0.5,
        cursor: editable ? "text" : "default",
        "&:hover": editable ? { bgcolor: "action.hover" } : undefined,
      }}
    >
      {value}
    </Typography>
  )
}

type DescriptionProps = {
  value: string | null
  editable: boolean
  onSave: (value: string | null) => void
}

export const InlineDescription = ({ value, editable, onSave }: DescriptionProps) => {
  const [draft, setDraft] = useState<string | null>(null)

  const save = () => {
    const next = draft?.trim() || null
    if (next !== value) onSave(next)
    setDraft(null)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Description
        </Typography>
        {editable && draft === null && (
          <Button size="small" sx={{ ml: "auto" }} onClick={() => setDraft(value ?? "")}>
            {value ? "Edit" : "Add"}
          </Button>
        )}
      </Box>
      {draft !== null ? (
        <Stack spacing={1}>
          <TextField
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            multiline
            minRows={4}
            maxRows={14}
            autoFocus
            fullWidth
            placeholder="Add more details…"
            error={draft.length > LIMITS.descriptionMaxLength}
            helperText={`${draft.length}/${LIMITS.descriptionMaxLength}`}
            slotProps={{ htmlInput: { "aria-label": "Task description" } }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              onClick={save}
              disabled={draft.length > LIMITS.descriptionMaxLength}
            >
              Save
            </Button>
            <Button size="small" color="inherit" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Typography
          data-testid="task-description"
          color={value ? "text.primary" : "text.secondary"}
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {value || "No description"}
        </Typography>
      )}
    </Box>
  )
}
