// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getType(object: any) {
  return Object.prototype.toString.call(object)
}

export default getType
