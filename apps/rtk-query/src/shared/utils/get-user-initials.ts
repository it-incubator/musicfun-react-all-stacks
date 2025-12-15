import type { FullName } from '@/features/profile'

export const getUserInitials = (fullName?: FullName, login?: string) => {
  return fullName?.name ? `${fullName.name[0]} ${fullName.surname[0]}` : (login?.[0] ?? '?')
}
