import { getPluralKey } from '@/shared/utils/get-plural-key.ts'

import i18n from '../translations/i18nConfiguration.ts'

export const formatCreatedDate = (addedAt: string | undefined) => {
  const lang = i18n.language || 'en'
  if (!addedAt) {
    return i18n.t('date.created')
  }

  const date = new Date(addedAt.toString())
  const now = new Date()
  const differTime = now.getTime() - date.getTime()
  const differDays = Math.floor(differTime / (1000 * 60 * 60 * 24))
  if (differDays === 0) {
    return `${i18n.t('date.created')} ${i18n.t('date.today')}`
  }
  if (differDays < 30) {
    const key = getPluralKey(differDays, lang, 'day')
    const daysText = i18n.t(key, { addedAt: differDays })
    return `${i18n.t('date.created')} ${daysText}`
  }

  const differMonths = Math.floor(differDays / 30)
  if (differMonths < 12) {
    const key = getPluralKey(differMonths, lang, 'month')
    const monthsText = i18n.t(key, { addedAt: differMonths })
    return `${i18n.t('date.created')} ${monthsText}`
  }

  const dateText = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  return `${i18n.t('date.created')} ${dateText}`
}
