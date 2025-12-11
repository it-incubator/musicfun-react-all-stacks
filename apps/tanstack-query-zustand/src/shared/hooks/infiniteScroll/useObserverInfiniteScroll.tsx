import * as React from 'react'

import type { IUseObserverInfiniteScroll } from './useObserverInfiniteScroll.types.ts'

/**
 * Custom hook for implementing infinite scroll using the Intersection Observer API.
 * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * @param {IUseObserverInfiniteScroll} props - An object containing configuration options for the observer.
 * @param {Function} [props.callBack] - The function to be called when the observed element enters the viewport or root
 *   element.
 * @param {React.RefObject<HTMLDivElement>} props.targetElement - The element that triggers the callback when it
 *   intersects with the root.
 * @param {React.RefObject<HTMLDivElement>} [props.rootElement] - The root element for the Intersection Observer.
 *   If not provided, the browser viewport is used as the root.
 * @param {string} [props.rootMargin='100px 0px'] - Margin around the root. For example, "100px 0px" means the callback
 *   will fire when the trigger element is 100px below the root and 0px from the sides.
 * @param {number | number[]} [props.threshold=1.0] - Threshold value(s) determining when the callback should fire.
 *   For example, 0.5 triggers when 50% of the element is visible; 1.0 triggers only when fully visible.
 *
 * @example
 * const MyComponent = () => {
 *   const targetElement = React.useRef<HTMLDivElement>(null);
 *   const rootElement = React.useRef<HTMLDivElement>(null);
 *
 *   useObserverInfiniteScroll({
 *     callBack: () => console.log('Element is visible!'),
 *     targetElement,
 *     rootElement,
 *     rootMargin: '100px 0px',
 *     threshold: 0.5
 *   });
 *
 *   return (
 *     <div ref={rootElement}>
 *       <div ref={targetElement}>Scroll down to see the magic happen!</div>
 *     </div>
 *   );
 * };
 */

const useObserverInfiniteScroll = (props: IUseObserverInfiniteScroll) => {
  const { callBack, rootMargin = '100px 0px', threshold = 1.0, targetElement, rootElement } = props

  const observerRef = React.useRef<IntersectionObserver | null>(null)

  React.useEffect(() => {
    if (callBack && targetElement.current) {
      const options: IntersectionObserverInit = {
        root: rootElement?.current, // Tracking relative to the browser window (viewport). null = entire screen
        rootMargin,
        threshold,
      }

      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          callBack()
        }
      }, options)

      // starts observing the element
      observerRef.current.observe(targetElement.current)
    }

    // Cleanup function - stops observing when component unmounts
    return () => {
      if (observerRef.current && targetElement.current) {
        observerRef.current.unobserve(targetElement.current)
      }
    }
  }, [targetElement, rootElement, callBack])
  // `callBack` is included in dependencies to ensure the latest function is always called
  // Without it, a stale closure would be used if the callback identity changes
}

export default useObserverInfiniteScroll
