import isArray from './isArray'
import isNull from './isNull'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject<T extends Record<string, any>>(value: any): value is T {
  return typeof value === 'object' && !isArray(value) && !isNull(value)
}

export default isObject
