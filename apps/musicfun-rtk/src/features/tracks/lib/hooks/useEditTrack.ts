import type { Nullable } from '@/common/types'
import { errorHandler, successToast } from '@/common/utils'
import { useFetchTrackByIdQuery, useUpdateTrackMutation } from '../../api/tracksApi.ts'
import type { UpdateTrackArgs } from '../../api/tracksApi.types.ts'
import { type MouseEvent, useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

export const useEditTrack = () => {
  const [trackId, setTrackId] = useState<Nullable<string>>(null)
  const [enabled, setEnabled] = useState(false)

  const [tagIds, setTagIds] = useState<string[]>([])
  const [artistsIds, setArtistsIds] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<UpdateTrackArgs>({
    defaultValues: {},
  })

  const [mutate] = useUpdateTrackMutation()

  const { data: trackResponse } = useFetchTrackByIdQuery(
    { trackId: trackId ? trackId : '' },
    {
      skip: !enabled,
    },
  )

  useEffect(() => {
    if (trackResponse) {
      const { title, lyrics, tags, artists, releaseDate } = trackResponse.data.attributes
      reset({ title, lyrics: lyrics ?? '' })
      setTagIds(tags?.map((tag) => tag.id) ?? [])
      setArtistsIds(artists?.map((artist) => artist.id) ?? [])
      setValue('releaseDate', releaseDate)
      setEnabled(false)
    }
  }, [trackResponse, reset, setValue])

  const editTrack = (e: MouseEvent, trackId: Nullable<string>) => {
    e.preventDefault()
    setTrackId(trackId ?? null)

    if (!trackId) return
    setEnabled(true)
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!trackId) return
    mutate({ trackId, payload: { ...payload, tagIds, artistsIds } })
      .unwrap()
      .then(() => {
        setTrackId(null)
        successToast('Track successfully updated')
      })
      .catch((e) => {
        errorHandler(e, setError)
      })
  }

  return { register, handleSubmit, onSubmit, trackId, editTrack, tagIds, setTagIds, artistsIds, setArtistsIds, errors }
}
