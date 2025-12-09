interface ControlFunctions {
  isPending(): boolean

  cancel(): void

  flush(): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DebouncedState<F extends (...args: any[]) => ReturnType<F>> = ((
  ...args: Parameters<F>
) => void) &
  ControlFunctions
