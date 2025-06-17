import { tagsKey } from "@/common/apiEntities"
import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import s from "./TagItem.module.css"
import { type Tag, tagsApi } from "@it-incubator/spotifun-api-sdk"

type Props = {
  tag: Tag
}

export const TagItem = ({ tag }: Props) => {
  const { name, id } = tag

  const { mutate, isPending: isRemoving } = useMutation({
    mutationFn: tagsApi.removeTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [tagsKey] }),
  })

  return (
    <div className={`item item--fullwidth flex-container ${s.container}`}>
      <div>
        <b>Tag:</b> <span>{name}</span>
      </div>
      <button onClick={() => mutate(id)} disabled={isRemoving}>
        {isRemoving ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
