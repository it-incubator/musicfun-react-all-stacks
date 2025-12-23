import type { TFunction } from 'i18next'
import { z } from 'zod'

export const editProfileSchemaBase = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t('profile.title.required_name'))
      .min(2, t('profile.title.min_value_name', { quantity: '2' }))
      .max(20, t('profile.title.max_value_name', { quantity: '20' })),
    surname: z
      .string()
      .min(1, t('profile.title.required_surname'))
      .min(2, t('profile.title.min_value_surname', { quantity: '2' }))
      .max(20, t('profile.title.max_value_surname', { quantity: '20' })),
  })
