import isString from './isString'

function isValidString<T extends string>(value: T): boolean
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidString<T extends string>(value: any): value is T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidString(value: any) {
  return isString(value) && value.trim().length > 0
}

export default isValidString
