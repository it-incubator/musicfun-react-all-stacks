import getType from './getType'

/**
 * Type predicate that narrows a value to a callable function type.
 *
 * Detects all kinds of JavaScript functions:
 * - Regular functions
 * - Arrow functions
 * - Async functions (`async function` / `async () =>`)
 * - Generator functions (`function*` / `function* ()`)
 * - Class constructors and methods
 *
 * Does **not** treat objects with a `call` method (like proxies) as functions unless they are actual function objects.
 *
 * @param value - The value to check
 * @returns `true` if the value is any kind of function, `false` otherwise
 *
 * @template TFunction - Constrained to function types with any parameter and return types
 *
 * @example
 * ```ts
 * if (isFunction(maybeCallback)) {
 *   maybeCallback(data) // TypeScript knows it's callable
 * }
 *
 * declare const handler: (() => void) | string
 * if (isFunction(handler)) {
 *   handler() // narrowed to () => void
 * }
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFunction<TFunction extends (...args: any[]) => any>(value: any): value is TFunction {
  return (
    getType(value) === '[object AsyncFunction]' ||
    getType(value) === '[object Function]' ||
    getType(value) === '[object GeneratorFunction]'
  )
}

export default isFunction
