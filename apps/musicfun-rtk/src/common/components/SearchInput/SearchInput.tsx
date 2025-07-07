import s from './SearchInput.module.css'
import { Loader } from '@/common/components'

type Props = {
  search: string
  setSearch: (search: string) => void
  isPending: boolean
  title: string
  placeholder: string
  autoFocus?: boolean
}

export const SearchInput = ({ setSearch, search, isPending, title, placeholder, autoFocus = true }: Props) => (
  <div className={s.inputWrapper}>
    <h2>{title}</h2>
    <div className={s.inputContainer}>
      <input
        className={s.search}
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        autoFocus={autoFocus}
      />
      {isPending && (
        <span className={s.inputLoader}>
          <Loader />
        </span>
      )}
    </div>
  </div>
)
