interface ThrottleControlFunctions {
  isPending(): boolean

  cancel(): void

  flush(): void
}

export interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThrottledState<F extends (...args: any[]) => ReturnType<F>> = ((
  ...args: Parameters<F>
) => void) &
  ThrottleControlFunctions
