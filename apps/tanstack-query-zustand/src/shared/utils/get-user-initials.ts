type FullName = {
  name?: string
  surname?: string
}

export const getUserInitials = (fullName?: FullName, userLogin?: string) => {
  const name = fullName?.name?.trim()
  const surname = fullName?.surname?.trim()

  if (name || surname) {
    const initials = `${name?.[0] || ''}${surname?.[0] || ''}`.trim()
    if (initials) return initials.toUpperCase()
  }

  if (userLogin?.trim()) {
    const loginParts = userLogin.trim().split(/\s+/)
    if (loginParts.length >= 2) {
      return `${loginParts[0][0]}${loginParts[1][0]}`.toUpperCase()
    }
    return userLogin.slice(0, 2).toUpperCase()
  }

  return 'U'
}
