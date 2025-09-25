import getType from './getType'

function isUndefined(value: unknown): value is undefined {
  return getType(value) === '[object Undefined]'
}

export default isUndefined
