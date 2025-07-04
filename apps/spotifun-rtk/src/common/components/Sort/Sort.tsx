import type { ChangeEvent } from "react"

type Props = {
  sortDirection: "asc" | "desc"
  sortBy: "addedAt" | "likesCount"
  setSortBy: (direction: "addedAt" | "likesCount") => void
  setSortDirection: (direction: "asc" | "desc") => void
}
export const Sort = ({ setSortDirection, setSortBy, sortDirection, sortBy }: Props) => {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    switch (value) {
      case "asc":
        setSortDirection("asc")
        break
      case "desc":
        setSortDirection("desc")
        break
      case "likesCount":
        setSortBy("likesCount")
        setSortDirection("desc")
        break
      default:
        setSortBy("addedAt")
        setSortDirection("desc")
    }
  }

  const value = sortBy === "likesCount" ? sortBy : sortDirection

  return (
    <div>
      <label>Sorted by </label>
      <select value={value} onChange={onChangeHandler}>
        <option value={"desc"}>Newest first</option>
        <option value={"asc"}>Oldest first</option>
        <option value={"likesCount"}>Top-rated first</option>
      </select>
    </div>
  )
}
