import isNaN from './inNun'
import isNumber from './isNumber'

function isValidNumber<T extends number>(value: T): boolean
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidNumber(value: any): value is number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidNumber(value: any) {
  return isNumber(value) && !isNaN(value)
}

export default isValidNumber
