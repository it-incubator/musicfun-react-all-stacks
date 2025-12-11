import * as React from 'react'

import type { IUseObserverInfiniteScroll } from './useObserverInfiniteScroll.types.ts'

/**
 * Custom hook for implementing infinite scroll using the Intersection Observer API.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API IntersectionObserver API}.
 *
 * @param {IUseObserverInfiniteScroll} props - An object containing configuration options for the observer.
 * @param {Function} [props.callBack] - The function to be called when the observed element enters the viewport or root
 *   element.
 * @param {React.RefObject<HTMLDivElement | null>} props.targetRef - The element that triggers the callback when it
 *   intersects with the root.
 * @param {React.RefObject<HTMLDivElement | null>} [props.rootRef] - The root element for the Intersection Observer.
 *   If not provided, the browser viewport is used as the root.
 * @param {string} [props.rootMargin='100px 0px'] - Margin around the root. For example, "100px 0px" means the callback
 *   will fire when the trigger element is 100px below the root and 0px from the sides.
 * @param {number | number[]} [props.threshold=1.0] - Threshold value(s) determining when the callback should fire.
 *   For example, 0.5 triggers when 50% of the element is visible; 1.0 triggers only when fully visible.
 *
 * @example
 * const MyComponent = () => {
 *   const targetRef = React.useRef<HTMLDivElement | null>(null);
 *   const rootRef = React.useRef<HTMLElement | null>(null);
 *
 *   useObserverInfiniteScroll({
 *     callBack: () => console.log('Element is visible!'),
 *     targetRef,
 *     rootRef,
 *     rootMargin: '100px 0px',
 *     threshold: 0.5
 *   });
 *
 *   return (
 *     <div ref={rootRef}>
 *       <div ref={targetRef}>Scroll down to see the magic happen!</div>
 *     </div>
 *   );
 * };
 */

const useObserverInfiniteScroll = (props: IUseObserverInfiniteScroll) => {
  const { callBack, rootMargin = '100px 0px', threshold = 1.0, targetRef, rootRef } = props

  const observerRef = React.useRef<IntersectionObserver | null>(null)

  React.useEffect(() => {
    const targetElement = targetRef.current

    if (callBack && targetElement) {
      const options: IntersectionObserverInit = {
        root: rootRef?.current, // Tracking relative to the browser window (viewport). null = entire screen
        rootMargin, // Start loading before the element appears
        threshold, // Trigger when % of the element becomes visible
      }

      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          callBack()
        }
      }, options)

      // starts observing the element
      observerRef.current.observe(targetElement)
    }

    // Cleanup function - stops observing when component unmounts
    return () => {
      if (observerRef.current && targetElement) {
        observerRef.current.unobserve(targetElement)
      }
    }
  }, [targetRef, rootRef, callBack])
  // `callBack` is included in dependencies to ensure the latest function is always called
  // Without it, a stale closure would be used if the callback identity changes
}

export default useObserverInfiniteScroll
