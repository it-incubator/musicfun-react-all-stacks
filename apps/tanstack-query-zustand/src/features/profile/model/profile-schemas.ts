import type { TFunction } from 'i18next'

type ValidateField = (value: string) => true | string

const createValidator =
  (t: TFunction, field: 'name' | 'surname'): ValidateField =>
  (value) => {
    const trimmed = value.trim()

    if (!trimmed) {
      return t(`profile.title.required_${field}`)
    }

    if (trimmed.length < 2) {
      return t(`profile.title.min_value_${field}`, { quantity: '2' })
    }

    if (trimmed.length > 20) {
      return t(`profile.title.max_value_${field}`, { quantity: '20' })
    }

    return true
  }

export const editProfileSchemaBase = (t: TFunction) => ({
  validateName: createValidator(t, 'name'),
  validateSurname: createValidator(t, 'surname'),
})
