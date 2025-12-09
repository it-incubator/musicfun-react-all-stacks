export function isNotEmptyArray(array?: unknown[]): array is unknown[] {
  return !!array && array.length > 0
}
