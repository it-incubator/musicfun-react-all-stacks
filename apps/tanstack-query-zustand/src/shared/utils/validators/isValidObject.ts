import { isNotEmptyArray } from './isNotEmptyArray.ts'
import isValid from './isValid'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidObject<T extends Record<string, any>>(value: T) {
  return isValid(value) && isNotEmptyArray(Object.keys(value))
}

export default isValidObject
