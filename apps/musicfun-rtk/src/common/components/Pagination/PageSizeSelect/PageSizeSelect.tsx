type Props = {
  pageSize: number
  onChange: (size: number) => void
  options?: number[]
}

export const PageSizeSelect = ({ pageSize, onChange, options = [2, 4, 8, 12, 16, 20] }: Props) => (
  <label>
    Show
    <select value={pageSize} onChange={(e) => onChange(Number(e.target.value))}>
      {options.map((size) => (
        <option value={size} key={size}>
          {size}
        </option>
      ))}
    </select>
    on page
  </label>
)
