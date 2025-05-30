import { useEffect, useState } from "react"

/**
 * Использование:
 * const [debouncedValue] = useDebounceValue(value, 400)
 */
export const useDebounceValue = <T>(value: T, delay: number): [T] => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return [debounced]
}
