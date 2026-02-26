import { type RefObject, useEffect, useRef, useState } from 'react'

export function useHover<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const [hover, setHover] = useState(false)
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const handleMouseEnter = () => setHover(true)
    const handleMouseLeave = () => setHover(false)

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter)
      node.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return [ref, hover]
}
