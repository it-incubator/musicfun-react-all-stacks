export const authKeys = {
  all: ['auth'],
  me: () => [...authKeys.all, 'me'],
}
