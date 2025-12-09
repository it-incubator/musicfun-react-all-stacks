import getType from './getType'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isString<TString extends string>(value: any): value is TString {
  return getType(value) === '[object String]'
}

export default isString
