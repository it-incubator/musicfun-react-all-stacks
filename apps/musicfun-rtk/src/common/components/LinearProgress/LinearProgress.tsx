import s from './LinearProgress.module.css'

type Props = {
  height?: number
}

export const LinearProgress = ({ height = 4 }: Props) => (
  <div className={s.root} style={{ height }}>
    <div className={`${s.bar} ${s.indeterminate1}`} />
    <div className={`${s.bar} ${s.indeterminate2}`} />
  </div>
)
