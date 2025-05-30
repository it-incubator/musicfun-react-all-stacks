import s from "./ArtistSearch.module.css"

type Props = {
  search: string
  setSearch: (search: string) => void
}

export const ArtistSearch = ({ setSearch, search }: Props) => {
  return (
    <div>
      <h2>Поиск по имени артиста</h2>
      <input
        className={s.search}
        placeholder="Введите имя"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        autoFocus
      />
    </div>
  )
}
