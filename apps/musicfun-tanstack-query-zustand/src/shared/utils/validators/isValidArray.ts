import isArray from './isArray'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidArray<T>(value: any): value is T[]
function isValidArray<T>(value: T[]): value is T[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidArray(value: any) {
  return isArray(value) && value.length > 0
}

export default isValidArray
