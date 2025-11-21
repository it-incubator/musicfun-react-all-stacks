import isValid from './isValid'
import isValidArray from './isValidArray'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidObject<T extends Record<string, any>>(value: T) {
  return isValid(value) && isValidArray<keyof T>(Object.keys(value))
}

export default isValidObject
