import * as AuthSession from 'expo-auth-session'

const base = AuthSession.makeRedirectUri({ scheme: 'musicfun' })
export const REDIRECT_URI_EXPO = `${base}/oauth/callback`
