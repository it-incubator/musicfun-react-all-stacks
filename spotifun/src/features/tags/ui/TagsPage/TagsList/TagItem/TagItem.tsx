import { tagsKey } from "@/common/apiEntities"
import { tagsApi } from "@/features/tags/api/tagsApi.ts"
import type { Tag } from "../../../../api/tagsApi.types.ts"
import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import s from "./TagItem.module.css"

type Props = {
  tag: Tag
}

export const TagItem = ({ tag }: Props) => {
  const { originalName, id } = tag

  const { mutate, isPending: isRemoving } = useMutation({
    mutationFn: tagsApi.removeTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [tagsKey] }),
  })

  return (
    <div className={`item item--fullwidth flex-container ${s.container}`}>
      <div>
        <b>Tag:</b> <span>{originalName}</span>
      </div>
      <button onClick={() => mutate(id)} disabled={isRemoving}>
        {isRemoving ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
