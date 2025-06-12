import { tracksKey } from "@/common/apiEntities"
import { queryClient } from "@/main.tsx"
import { tracksApi } from "@it-incubator/spotifun-api-sdk"
import { useMutation } from "@tanstack/react-query"
import type { MouseEvent } from "react"

export const useRemoveTrackFromPlaylist = (playlistId?: string) => {
  const { mutate } = useMutation({
    mutationFn: tracksApi.removeTrackFromPlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [tracksKey, playlistId] }),
  })

  const removeTrackFromPlaylist = (e: MouseEvent, trackId: string) => {
    e.preventDefault()
    if (!playlistId) return
    if (confirm("Вы уверены, что хотите удалить трек из плейлиста?")) {
      mutate({ playlistId, trackId })
    }
  }

  return { removeTrackFromPlaylist }
}
