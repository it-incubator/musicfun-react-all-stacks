import type { Attributes } from "@/features/playlists/api/playlistsApi.types.ts"

type Props = {
  attributes: Attributes
}

export const PlaylistDescription = ({ attributes }: Props) => {
  const { title, description, tags, addedAt } = attributes
  return (
    <>
      <div>
        <b>title:</b> <span>{title}</span>
      </div>
      <div>
        <b>description:</b> <span>{description}</span>
      </div>
      <div>
        <b>tags:</b> <span>{tags.length ? tags.map((t) => t) : "Теги не добавлены"}</span>
      </div>
      <div>
        <b>added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
      </div>
    </>
  )
}
