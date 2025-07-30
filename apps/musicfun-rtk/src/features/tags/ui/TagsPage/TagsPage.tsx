import { PageTitle } from '@/common/components'
import { TagsList } from './TagsList/TagsList.tsx'
import { AddTagForm } from './AddTagForm/AddTagForm.tsx'

export const TagsPage = () => {
  return (
    <>
      <PageTitle>Tags Page</PageTitle>
      <AddTagForm />
      <TagsList />
    </>
  )
}
