import { type ChangeEvent, useRef } from "react"

import { showNotificationAC } from "@/app/model/app-slice.ts"
import { LIMITS } from "@/common/constants"
import { useAppDispatch } from "@/common/hooks"
import { readImageSize } from "@/common/utils"

import { useUploadBoardCoverMutation } from "../api/boardsApi.ts"

/**
 * Hidden file input + client-side checks that mirror the backend rules:
 * the image must be landscape and at least 500px high.
 */
export const useCoverUpload = (boardId: string) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const [uploadCover, { isLoading }] = useUploadBoardCoverMutation()

  const notifyError = (message: string) => dispatch(showNotificationAC({ message, severity: "error" }))

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    try {
      const { width, height } = await readImageSize(file)
      if (width <= height) return notifyError("Cover must be a landscape image (wider than tall)")
      if (height < LIMITS.coverMinHeight) return notifyError(`Cover must be at least ${LIMITS.coverMinHeight}px high`)
    } catch {
      return notifyError("File is not a supported image")
    }

    try {
      await uploadCover({ boardId, file }).unwrap()
      dispatch(showNotificationAC({ message: "Cover updated. Previews will appear in about a minute" }))
    } catch {
      // error is shown by the base query
    }
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      hidden
      onChange={onChange}
      data-testid={`cover-input-${boardId}`}
    />
  )

  return { input, open: () => inputRef.current?.click(), isUploading: isLoading }
}
