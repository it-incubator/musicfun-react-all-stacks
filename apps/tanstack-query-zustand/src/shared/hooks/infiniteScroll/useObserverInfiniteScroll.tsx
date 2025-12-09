import * as React from 'react'

import type { IUseObserverInfiniteScroll } from './useObserverInfiniteScroll.types.ts'

/**
 * Custom hook for implementing infinite scroll using the Intersection Observer API.
 *
 * @param {IUseObserverInfiniteScroll} props - An object containing configuration options for the observer.
 * @param {Function} [props.callBack] - The function to be called when the observed element enters the viewport or root
 *   element.
 * @param {React.RefObject<HTMLDivElement>} props.triggerRef - The element that triggers the callback when it
 *   intersects with the root.
 * @param {React.RefObject<HTMLDivElement>} [props.wrapperRef] - The root element for the Intersection Observer.
 *   If not provided, the browser viewport is used as the root.
 * @param {string} [props.rootMargin='100px 0px'] - Margin around the root. For example, "100px 0px" means the callback
 *   will fire when the trigger element is 100px below the root and 0px from the sides.
 * @param {number | number[]} [props.threshold=1.0] - Threshold value(s) determining when the callback should fire.
 *   For example, 0.5 triggers when 50% of the element is visible; 1.0 triggers only when fully visible.
 *
 * @example
 * const MyComponent = () => {
 *   const triggerRef = React.useRef<HTMLDivElement>(null);
 *   const wrapperRef = React.useRef<HTMLDivElement>(null);
 *
 *   useObserverInfiniteScroll({
 *     callBack: () => console.log('Element is visible!'),
 *     triggerRef,
 *     wrapperRef,
 *     rootMargin: '100px 0px',
 *     threshold: 0.5
 *   });
 *
 *   return (
 *     <div ref={wrapperRef}>
 *       <div ref={triggerRef}>Scroll down to see the magic happen!</div>
 *     </div>
 *   );
 * };
 */

const useObserverInfiniteScroll = (props: IUseObserverInfiniteScroll) => {
  const { callBack, rootMargin = '100px 0px', threshold = 1.0, targetElement, rootElement } = props

  const observerRef = React.useRef<IntersectionObserver | null>(null)

  console.log(' : ', [targetElement, rootElement])

  React.useEffect(() => {
    console.log('💩 useEffect')
    if (callBack && targetElement) {
      const options: IntersectionObserverInit = {
        root: rootElement,
        rootMargin,
        threshold,
      }

      observerRef.current = new IntersectionObserver(async ([entry]) => {
        if (entry.isIntersecting) {
          callBack?.(entry)
        }
      }, options)

      observerRef.current.observe(targetElement)
    }

    return () => {
      if (observerRef.current && targetElement) {
        observerRef.current.unobserve(targetElement)
      }
    }
    //}, [callBack, rootMargin, threshold, triggerRef, wrapperRef])
  }, [targetElement, rootElement])
}

export default useObserverInfiniteScroll
