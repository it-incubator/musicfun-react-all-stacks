import { Typography } from '@/shared/components'

import s from './ArtistCard.module.css'

type Props = {
  image: string
  name: string
}

export const ArtistCard = ({ image, name }: Props) => {
  return (
    <div className={s.card}>
      <div className={s.image}>
        <img src={image} alt="" aria-hidden />
      </div>

      <Typography variant="h3" className={s.title}>
        {name}
      </Typography>
    </div>
  )
}
