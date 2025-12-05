import getType from './getType'

function isNumber<T extends number>(value: unknown): value is T {
  return getType(value) === '[object Number]'
}

export default isNumber
