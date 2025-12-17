import { useTranslation } from 'react-i18next'

import { editProfileSchemaBase } from '@/features/profile/model/profile-schemas'

export const useEditProfileSchema = () => {
  const { t } = useTranslation()

  const editProfileSchema = editProfileSchemaBase(t)

  return { editProfileSchema }
}
