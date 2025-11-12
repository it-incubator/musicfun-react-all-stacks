import { Loader } from '@/common/components'
import s from './SearchInput.module.css'

type Props = {
  search: string
  setSearch: (search: string) => void
  isPending: boolean
  placeholder: string
  autoFocus?: boolean
}

export const SearchInput = ({ setSearch, search, isPending, placeholder, autoFocus = true }: Props) => (
  <div className={s.inputWrapper}>
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
