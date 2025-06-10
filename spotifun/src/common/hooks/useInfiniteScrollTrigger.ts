import { useEffect, useRef } from "react"

type UseInfiniteScrollTriggerOptions = {
  callback: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export const useInfiniteScrollTrigger = ({
  callback,
  hasNextPage,
  isFetchingNextPage,
}: UseInfiniteScrollTriggerOptions) => {
  const triggerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = triggerRef.current
    if (!node || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isFetchingNextPage) {
          callback()
        }
      },
      { threshold: 1.0 },
    )

    observer.observe(node)

    return () => observer.unobserve(node)
  }, [callback, hasNextPage, isFetchingNextPage])

  return { triggerRef }
}
