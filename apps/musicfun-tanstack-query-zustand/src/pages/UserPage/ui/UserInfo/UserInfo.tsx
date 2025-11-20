import { Button, Typography } from '@/shared/components'
import { EditIcon } from '@/shared/icons'

import s from './UserInfo.module.css'

export const UserInfo = () => {
  return (
    <div className={s.box}>
      <div className={s.avatar}>
        <img src={'https://unsplash.it/192/192'} alt="User avatar" />
      </div>
      <Typography variant="h2">Martin Fowler</Typography>

      <Button variant="secondary">
        <EditIcon /> Edit profile
      </Button>
      <dl className={s.descriptionList}>
        <div className={s.descriptionItem}>
          <Typography as="dd" variant="body1">
            58
          </Typography>
          <Typography as="dt" variant="body2">
            Playlists
          </Typography>
        </div>
        <div className={s.descriptionItem}>
          <Typography as="dd" variant="body1">
            100
          </Typography>
          <Typography as="dt" variant="body2">
            Tracks
          </Typography>
        </div>
      </dl>
    </div>
  )
}
