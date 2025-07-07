import { useEffect, useRef } from 'react'

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

    // IntersectionObserver следит за элементами и сообщает, насколько они видимы во вьюпорте.
    // https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isFetchingNextPage) {
          callback()
        }
      },
      // Сработает только когда элемент полностью войдёт в зону видимости.
      { threshold: 1.0 },
    )

    observer.observe(node)

    return () => observer.unobserve(node)
  }, [callback, hasNextPage, isFetchingNextPage])

  return { triggerRef }
}
