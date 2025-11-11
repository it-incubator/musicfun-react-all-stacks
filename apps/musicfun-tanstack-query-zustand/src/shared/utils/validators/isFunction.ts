import getType from './getType'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFunction<TFunction extends (...args: any[]) => any>(value: any): value is TFunction {
  return (
    getType(value) === '[object AsyncFunction]' ||
    getType(value) === '[object Function]' ||
    getType(value) === '[object GeneratorFunction]'
  )
}

export default isFunction
