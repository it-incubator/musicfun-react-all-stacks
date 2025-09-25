import { useCallback, useEffect, useRef } from 'react'

type Props = {
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  rootMargin?: string
  threshold?: number
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetching,
  fetchNextPage,
  rootMargin = '100px',
  threshold = 0.1,
}: Props) => {
  const observerRef = useRef<HTMLDivElement>(null)

  const loadMoreHandler = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, fetchNextPage])

  useEffect(() => {
    // IntersectionObserver monitors elements and reports how visible they are in the viewport
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver(
      (entries) => {
        // entries - observed element
        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        root: null, // Tracking relative to the browser window (viewport). null = entire screen
        rootMargin, // Start loading before the element appears
        threshold, // Trigger when % of the element becomes visible
      },
    )

    const currentObserverRef = observerRef.current
    if (currentObserverRef) {
      // starts observing the element
      observer.observe(currentObserverRef)
    }

    // Cleanup function - stops observing when component unmounts
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [loadMoreHandler, rootMargin, threshold])

  return { observerRef }
}
