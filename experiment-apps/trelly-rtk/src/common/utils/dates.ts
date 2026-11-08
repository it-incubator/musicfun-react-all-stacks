const dateFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" })
const shortDateFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" })

export const formatDate = (iso: string | null | undefined) => (iso ? dateFormatter.format(new Date(iso)) : "—")

export const formatShortDate = (iso: string) => {
  const date = new Date(iso)
  return date.getFullYear() === new Date().getFullYear() ? shortDateFormatter.format(date) : dateFormatter.format(date)
}

/** ISO string → value for <input type="date"> (local time) */
export const toDateInputValue = (iso: string | null | undefined) => {
  if (!iso) return ""
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** <input type="date"> value → ISO string (local midnight) or null */
export const fromDateInputValue = (value: string) => (value ? new Date(`${value}T00:00:00`).toISOString() : null)

export const isOverdue = (iso: string | null) => {
  if (!iso) return false
  const endOfDeadlineDay = new Date(iso)
  endOfDeadlineDay.setHours(23, 59, 59, 999)
  return endOfDeadlineDay.getTime() < Date.now()
}

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const trim = (n: number) => String(Number(n.toFixed(1)))
  if (bytes < 1024 * 1024) return `${trim(bytes / 1024)} KB`
  return `${trim(bytes / 1024 / 1024)} MB`
}
