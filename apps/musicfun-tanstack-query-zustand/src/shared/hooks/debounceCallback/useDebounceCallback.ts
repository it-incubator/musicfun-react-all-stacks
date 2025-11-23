import * as React from 'react'

import type { DebouncedState } from './useDebounceCallback.types.ts'

/**
 * Custom hook for debouncing a function — delays its execution until a specified
 * number of milliseconds have passed since the last time it was invoked.
 *
 * Returns a wrapped function with additional control methods:
 * - `isPending()` — checks whether a debounced call is currently scheduled
 * - `cancel()`    — cancels the scheduled call
 * - `flush()`     — immediately executes the function (if it was scheduled)
 *
 * @template F Type of the function being debounced
 * @param {F} callback The function to debounce
 * @param {number} [delay=300] Delay in milliseconds
 * @returns {DebouncedState<F>} Debounced function with control methods
 *
 * @example
 * const debouncedSearch = useDebounceCallback((query: string) => {
 *   fetchUsers(query);
 * }, 500);
 *
 * // Calls will be delayed by 500 ms
 * debouncedSearch('react');
 * debouncedSearch('react hook'); // previous call will be cancelled
 *
 * if (debouncedSearch.isPending()) {
 *   console.log('Request has not been sent yet...');
 *   debouncedSearch.flush(); // send immediately
 * }
 *
 * debouncedSearch.cancel(); // cancel completely
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounceCallback<F extends (...args: any[]) => ReturnType<F>>(
  callback: F,
  delay = 300
): DebouncedState<F> {
  const timerRef = React.useRef<null | ReturnType<typeof setTimeout>>(null)
  const argsRef = React.useRef<Parameters<F> | null>(null)
  const callbackRef = React.useRef(callback)

  callbackRef.current = callback

  React.useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [delay])

  return React.useMemo(() => {
    const debounced = (...args: Parameters<F>) => {
      argsRef.current = args

      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        timerRef.current = null
        const argsToUse = argsRef.current
        argsRef.current = null

        if (argsToUse != null) {
          callbackRef.current?.(...argsToUse)
        }
      }, delay)
    }

    const func = debounced as DebouncedState<F>

    func.isPending = () => {
      return !!timerRef.current
    }

    func.cancel = () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    func.flush = () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (argsRef.current != null) {
        const args = argsRef.current
        argsRef.current = null
        callbackRef.current?.(...args)
      }
    }

    return func
  }, [delay])
}

export default useDebounceCallback
