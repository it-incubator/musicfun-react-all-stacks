export const joinUrl = (...parts: (string | number | undefined | null)[]): string => {
  return parts
    .filter(Boolean) // убираем undefined / null / ''
    .map((p, i) =>
      i === 0
        ? String(p).replace(/\/+$/, '') // у первого убираем хвостовые /
        : String(p).replace(/^\/+|\/+$/g, ''),
    )
    .join('/')
}
