export type FullName = {
  name: string
  surname: string
}

export type Profile = {
  fullName: FullName
  avatar: string | null
}
