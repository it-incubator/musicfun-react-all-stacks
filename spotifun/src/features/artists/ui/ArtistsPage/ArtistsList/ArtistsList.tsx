import { ArtistQueryKey, artistsApi } from "@/features/artists/api/artistsApi.ts"
import { queryClient } from "@/main.tsx"
import { useMutation, useQuery } from "@tanstack/react-query"
import s from "./ArtistsList.module.css"

export const ArtistsList = () => {
  const { data } = useQuery({
    queryKey: [ArtistQueryKey],
    queryFn: () => artistsApi.findArtists(""),
  })

  const { mutate: removeArtistMutation, isPending: isRemoving } = useMutation({
    mutationFn: artistsApi.removeArtist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [ArtistQueryKey] }),
  })

  return (
    <div>
      <h2>Список артистов</h2>
      <>
        {data?.data.map((artist) => {
          const { name, id } = artist
          return (
            <div key={id} className={`item item--fullwidth flex-container ${s.container}`}>
              <div>
                <b>Name:</b> <span>{name}</span>
              </div>
              <button onClick={() => removeArtistMutation(id)} disabled={isRemoving}>
                {isRemoving ? "Удаление..." : "Удалить"}
              </button>
            </div>
          )
        })}
      </>
    </div>
  )
}
