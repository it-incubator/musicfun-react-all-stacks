import { Button, Typography } from '@/shared/components'
import { EditIcon } from '@/shared/icons'
import { useTranslation } from 'react-i18next'

import s from './UserInfo.module.css'

export const UserInfo = () => {
  const { t } = useTranslation()

  return (
    <div className={s.box}>
      <div className={s.avatar}>
        <img src={'https://unsplash.it/192/192'} alt={t('profile.label.avatar')} />
      </div>
      <Typography variant="h2">Martin Fowler</Typography>

      <Button variant="secondary">
        <EditIcon /> {t('button.edit_profile')}
      </Button>
      <dl className={s.descriptionList}>
        <div className={s.descriptionItem}>
          <Typography as="dd" variant="body1">
            58
          </Typography>
          <Typography as="dt" variant="body2">
            {t('tabs.playlists')}
          </Typography>
        </div>
        <div className={s.descriptionItem}>
          <Typography as="dd" variant="body1">
            100
          </Typography>
          <Typography as="dt" variant="body2">
            {t('tabs.tracks')}
          </Typography>
        </div>
      </dl>
    </div>
  )
}
