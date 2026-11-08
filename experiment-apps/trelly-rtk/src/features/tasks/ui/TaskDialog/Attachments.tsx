import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined"
import CloseIcon from "@mui/icons-material/Close"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { type ChangeEvent, useRef } from "react"

import { showNotificationAC } from "@/app/model/app-slice.ts"
import { ATTACHMENT_MIME_TYPES, LIMITS } from "@/common/constants"
import { useAppDispatch } from "@/common/hooks"
import { formatFileSize, pickImage } from "@/common/utils"

import { useDeleteAttachmentMutation, useUploadAttachmentsMutation } from "../../api/tasksApi.ts"
import type { Attachment } from "../../api/tasksApi.types.ts"

type Props = {
  boardId: string
  taskId: string
  attachments: Attachment[]
  isOwner: boolean
}

const ALLOWED_TYPES = ATTACHMENT_MIME_TYPES.map((type) => type.split(";")[0])

const validateFiles = (files: File[], currentCount: number): string | null => {
  if (currentCount + files.length > LIMITS.attachmentsPerTask) {
    return `A task holds at most ${LIMITS.attachmentsPerTask} files`
  }
  const tooBig = files.find((f) => f.size > LIMITS.attachmentMaxSize)
  if (tooBig) return `“${tooBig.name}” is larger than ${formatFileSize(LIMITS.attachmentMaxSize)}`
  const unsupported = files.find((f) => !ALLOWED_TYPES.includes(f.type))
  if (unsupported) return `“${unsupported.name}” has an unsupported type`
  return null
}

const FileIcon = ({ contentType }: { contentType: string }) => {
  if (contentType === "application/pdf") return <PictureAsPdfOutlinedIcon />
  if (contentType.startsWith("audio/")) return <AudioFileOutlinedIcon />
  if (contentType.startsWith("text/")) return <DescriptionOutlinedIcon />
  return <InsertDriveFileOutlinedIcon />
}

export const Attachments = ({ boardId, taskId, attachments, isOwner }: Props) => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadAttachments, { isLoading: isUploading }] = useUploadAttachmentsMutation()
  const [deleteAttachment] = useDeleteAttachmentMutation()

  const isFull = attachments.length >= LIMITS.attachmentsPerTask

  const onFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (!files.length) return

    const error = validateFiles(files, attachments.length)
    if (error) {
      dispatch(showNotificationAC({ message: error, severity: "error" }))
      return
    }

    try {
      await uploadAttachments({ boardId, taskId, files }).unwrap()
      dispatch(showNotificationAC({ message: files.length > 1 ? `${files.length} files attached` : "File attached" }))
    } catch {
      // error is shown by the base query
    }
  }

  return (
    <Box data-testid="attachments">
      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Attachments
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          {attachments.length}/{LIMITS.attachmentsPerTask}
        </Typography>
        {isOwner && (
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              hidden
              accept={ALLOWED_TYPES.join(",")}
              onChange={onFilesChange}
              data-testid="attachments-input"
            />
            <Tooltip title={isFull ? "Maximum files reached" : `Images, PDF, text or audio up to 100 KB`}>
              <span style={{ marginLeft: "auto" }}>
                <Button
                  size="small"
                  startIcon={<UploadFileIcon />}
                  onClick={() => inputRef.current?.click()}
                  disabled={isFull || isUploading}
                >
                  {isUploading ? "Uploading…" : "Attach files"}
                </Button>
              </span>
            </Tooltip>
          </>
        )}
      </Box>

      {attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No files attached
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 1.5 }}>
          {attachments.map((attachment) => (
            <AttachmentTile
              key={attachment.id}
              attachment={attachment}
              onDelete={isOwner ? () => deleteAttachment({ boardId, taskId, attachmentId: attachment.id }) : undefined}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

type TileProps = {
  attachment: Attachment
  onDelete?: () => void
}

const AttachmentTile = ({ attachment, onDelete }: TileProps) => {
  const preview = attachment.isImage ? pickImage(attachment.images, ["medium", "original"]) : null

  return (
    <Box
      data-testid="attachment"
      sx={{
        position: "relative",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        "&:hover .attachment-delete": { opacity: 1 },
      }}
    >
      <Box
        component="a"
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        sx={{ display: "block", color: "inherit", textDecoration: "none" }}
      >
        <Box
          sx={{
            height: 90,
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "text.secondary",
            "& svg": { fontSize: 36 },
          }}
        >
          {preview ? (
            <Box
              component="img"
              src={preview.url}
              alt={attachment.originalName}
              sx={{ display: "block", width: "100%", height: 90, objectFit: "cover" }}
            />
          ) : (
            <FileIcon contentType={attachment.contentType} />
          )}
        </Box>
        <Box sx={{ px: 1, py: 0.75 }}>
          <Typography variant="caption" component="p" noWrap fontWeight={600} title={attachment.originalName}>
            {attachment.originalName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(attachment.fileSize)}
          </Typography>
        </Box>
      </Box>
      {onDelete && (
        <IconButton
          className="attachment-delete"
          size="small"
          onClick={onDelete}
          aria-label={`Delete ${attachment.originalName}`}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            opacity: { xs: 1, md: 0 },
            transition: "opacity .15s",
            bgcolor: "rgba(15, 23, 42, 0.6)",
            color: "#fff",
            "&:hover": { bgcolor: "error.main" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  )
}
