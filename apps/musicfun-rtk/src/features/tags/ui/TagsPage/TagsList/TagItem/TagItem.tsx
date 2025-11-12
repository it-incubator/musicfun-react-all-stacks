import { useRemoveTagMutation } from '../../../../api/tagsApi.ts'
import type { Tag } from '../../../../api/tagsApi.types.ts'
import s from './TagItem.module.css'

type Props = {
  tag: Tag
}

export const TagItem = ({ tag }: Props) => {
  const { name, id } = tag

  const [removeTag, { isLoading }] = useRemoveTagMutation()

  return (
    <div className={`item item--fullwidth flex-container ${s.container}`}>
      <div>
        <b>Tag:</b> <span>{name}</span>
      </div>
      <button onClick={() => removeTag({ id })} disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}
