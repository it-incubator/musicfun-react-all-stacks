import { useEffect, useState } from 'react'

export const useDebounceValue = <T>(value: T, delay: number = 700): [T] => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return [debounced]
}
