import getType from './getType'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArray<T>(value: any): value is T[] {
  return getType(value) === '[object Array]'
}

export default isArray
