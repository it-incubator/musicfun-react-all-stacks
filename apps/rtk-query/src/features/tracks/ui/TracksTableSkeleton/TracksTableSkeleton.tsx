import { Skeleton, Table, TableHead, TableHeaderCell, TableRow } from '@/shared/components'
import { ClockIcon } from '@/shared/icons'
import { useTranslation } from 'react-i18next'

type Props = {
  count?: number
}

export const TracksTableSkeleton = ({ count = 5 }: Props) => {
  const { t } = useTranslation()

  const TABLE_COLUMNS = [
    { title: '#', width: '40px' },
    { title: t('tracks.table.track') },
    { title: '' },
    { title: t('tracks.table.date_added'), width: '120px' },
    { title: t('tracks.table.actions'), width: '150px' },
    { title: <ClockIcon />, width: '60px' },
  ]

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {TABLE_COLUMNS.map((column, index) => (
              <TableHeaderCell key={index} style={{ width: column.width }}>
                {column.title}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
      {Array.from({ length: count }).map((_el, i) => (
        <Skeleton height={'70px'} key={i} />
      ))}
    </>
  )
}
