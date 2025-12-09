import isNull from './isNull'
import isUndefined from './isUndefined'

function isValid<T>(value: T | null | undefined): value is T {
  return !isNull(value) && !isUndefined(value)
}

export default isValid
