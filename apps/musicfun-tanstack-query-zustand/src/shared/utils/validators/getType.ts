/**
 * Returns the internal `[[Class]]` property of a value as a string using `Object.prototype.toString`.
 *
 * This is the most reliable way to detect the exact type of a value in JavaScript,
 * especially for distinguishing between `null`, `Array`, `Date`, built-in objects, and various function types.
 *
 * @param object - The value whose type should be determined
 * @returns A string in the format `[object XXX]`, e.g. `[object Array]`, `[object Null]`, `[object AsyncFunction]`
 *
 * @example
 * ```ts
 * getType(null)            // '[object Null]'
 * getType([])              // '[object Array]'
 * getType(async () => {})  // '[object AsyncFunction]'
 * getType(function* () {}) // '[object GeneratorFunction]'
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getType(object: any) {
  return Object.prototype.toString.call(object)
}

export default getType
