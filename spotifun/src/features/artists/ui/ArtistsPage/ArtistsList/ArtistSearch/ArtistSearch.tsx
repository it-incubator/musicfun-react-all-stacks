import { Loader } from "@/common/components"
import s from "./ArtistSearch.module.css"

type Props = {
  search: string
  setSearch: (search: string) => void
  isPending: boolean
}

export const ArtistSearch = ({ setSearch, search, isPending }: Props) => {
  return (
    <div className={s.inputWrapper}>
      <h2>Поиск по имени артиста</h2>
      <div className={s.inputContainer}>
        <input
          className={s.search}
          placeholder="Введите имя"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          autoFocus
        />
        {isPending && (
          <span className={s.inputLoader}>
            <Loader />
          </span>
        )}
      </div>
    </div>
  )
}
