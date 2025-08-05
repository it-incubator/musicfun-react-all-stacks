import { useEffect, useRef } from 'react'

type UseInfiniteScrollTriggerOptions = {
  callback: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  cursor?: string
  pageNumber?: number
}

export const useInfiniteScrollTrigger = ({
  callback,
  hasNextPage,
  isFetchingNextPage,
  cursor,
  pageNumber,
}: UseInfiniteScrollTriggerOptions) => {
  const triggerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = triggerRef.current
    if (!node || !hasNextPage) return

    // IntersectionObserver watches elements and reports how visible they are in the viewport.
    // https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isFetchingNextPage) {
          callback()
        }
      },
      // Triggers only when element fully enters the visibility zone.
      { threshold: 1.0 },
    )

    observer.observe(node)

    return () => observer.unobserve(node)
  }, [callback, hasNextPage, isFetchingNextPage, cursor, pageNumber])

  return { triggerRef }
}
