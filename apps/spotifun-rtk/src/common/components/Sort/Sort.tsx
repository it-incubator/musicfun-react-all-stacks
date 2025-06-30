import type { ChangeEvent } from "react"

type Props = {
  direction: "new" | "old" | "topRate"
  setSortDirection: (direction: "new" | "old" | "topRate") => void
}
export const Sort = ({ setSortDirection, direction }: Props) => {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "new" || value === "old" || value === "topRate") {
      setSortDirection(value)
    }
  }

  return (
    <div>
      <label>Sorted by </label>
      <select value={direction} onChange={onChangeHandler}>
        <option value={"new"}>Newest first</option>
        <option value={"old"}>Oldest first</option>
        <option value={"topRate"}>Top-rated first</option>
      </select>
    </div>
  )
}
