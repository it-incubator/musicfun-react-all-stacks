import type { Tag } from '@/features/tags/api/tagsApi.types.ts'

type Props = {
  tags: Tag[]
}

export const DescriptionTags = ({ tags }: Props) => {
  return (
    <>
      {!!tags.length && (
        <div>
          <b>Tags:</b>{' '}
          <div className={'tagsList'}>
            {tags.map((t) => {
              return (
                <div key={t.id} className={'tagItem'}>
                  {`# ${t.name}`}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
