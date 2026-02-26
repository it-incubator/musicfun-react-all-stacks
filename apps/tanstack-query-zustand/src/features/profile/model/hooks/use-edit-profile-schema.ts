import { useTranslation } from 'react-i18next'

import { editProfileSchemaBase } from '../profile-schemas'

export const useEditProfileSchema = () => {
  const { t } = useTranslation()

  const editProfileValidation = editProfileSchemaBase(t)

  return { editProfileValidation }
}
