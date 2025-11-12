type QueryParamValue = string | number | (string | number)[] | undefined | boolean

/**
 * Формирует строку запроса (query string) из объекта параметров.
 *
 * Пропускает `undefined` и `null` значения.
 * Значения типа `number` автоматически преобразуются в строки.
 * Массивы сериализуются с повторяющимися ключами (например: `tagsIds=1&tagsIds=2`).
 *
 * @param {Record<string, QueryParamValue>} params - Объект с параметрами запроса
 * @returns {string} Готовая строка запроса (например: `key=value&arr=1&arr=2`)
 *
 * @example
 * buildQueryString({ search: 'text', tagsIds: [1, 2], page: 3 })
 * // Вернёт: "search=text&tagsIds=1&tagsIds=2&page=3"
 */

export function buildQueryString(params: Record<string, QueryParamValue>): string {
  const searchParams = new URLSearchParams()
  for (const key in params) {
    const value = params[key]
    if (value === undefined || value === null) continue

    // Если это массив, добавляем каждый элемент отдельно (например: tagsIds=1&tagsIds=2)
    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val !== undefined && val !== null) searchParams.append(key, String(val))
      })
    } else {
      searchParams.append(key, String(value))
    }
  }
  return searchParams.toString()
}
