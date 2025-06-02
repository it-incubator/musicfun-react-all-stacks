import { PageTitle } from "@/common/components"
import { AddTagForm } from "./AddTagForm/AddTagForm.tsx"

export const TagsPage = () => {
  return (
    <div>
      <PageTitle>Страница тегов</PageTitle>
      <AddTagForm />
    </div>
  )
}
