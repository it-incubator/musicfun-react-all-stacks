import { PageTitle } from '@/common/components'
import { TagsList } from './TagsList/TagsList.tsx'
import { AddTagForm } from './AddTagForm/AddTagForm.tsx'

export const TagsPage = () => {
  return (
    <>
      <PageTitle>Страница тегов</PageTitle>
      <AddTagForm />
      <TagsList />
    </>
  )
}
