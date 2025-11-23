import * as React from 'react'

import type { ThrottledState, ThrottleOptions } from './useThrottleCallback.types.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useThrottleCallback<F extends (...args: any[]) => ReturnType<F>>(
  callback: F,
  delay: number = 300,
  options: ThrottleOptions = {}
): ThrottledState<F> {
  const { leading = true, trailing = true } = options

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastExecTimeRef = React.useRef<number>(0)
  const pendingArgsRef = React.useRef<Parameters<F> | null>(null)
  const callbackRef = React.useRef(callback)

  callbackRef.current = callback

  React.useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [delay])

  return React.useMemo(() => {
    const execute = (args: Parameters<F>) => {
      callbackRef.current?.(...args)
      lastExecTimeRef.current = Date.now()
    }

    const throttled = (...args: Parameters<F>) => {
      const now = Date.now()
      const elapsed = now - lastExecTimeRef.current

      if (!leading && lastExecTimeRef.current === 0) {
        lastExecTimeRef.current = now
      }

      const remaining = delay - elapsed

      if (trailing) {
        pendingArgsRef.current = args
      }

      if (remaining <= 0 || !leading) {
        if (timerRef.current != null) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }

        if (leading || lastExecTimeRef.current !== 0) {
          execute(args)
        }
        return
      }

      if (timerRef.current == null) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null

          if (trailing && pendingArgsRef.current != null) {
            const argsToUse = pendingArgsRef.current
            pendingArgsRef.current = null
            execute(argsToUse)
          }
        }, remaining)
      }
    }

    const func = throttled as ThrottledState<F>

    func.isPending = () => {
      return timerRef.current != null || pendingArgsRef.current != null
    }

    func.cancel = () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      pendingArgsRef.current = null
    }

    func.flush = () => {
      if (pendingArgsRef.current != null) {
        const args = pendingArgsRef.current
        pendingArgsRef.current = null

        if (timerRef.current != null) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }

        execute(args)
      }
    }

    return func
  }, [delay, leading, trailing])
}

export default useThrottleCallback
