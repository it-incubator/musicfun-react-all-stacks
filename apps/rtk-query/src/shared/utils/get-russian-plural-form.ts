export const getRussianPluralForm = (count: number, type: 'day' | 'month'): string => {
  const lastDigit = count % 10

  if (lastDigit === 1 && count !== 11) {
    return `date.${type}Ago`
  }

  if (lastDigit >= 2 && lastDigit <= 4 && !(count >= 12 && count <= 14)) {
    return type === 'day' ? 'date.fewDaysAgo' : 'date.fewMonthAgo'
  }

  return `date.${type}sAgo`
}
