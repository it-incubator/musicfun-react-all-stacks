import { View, Text, Pressable, StyleSheet } from 'react-native'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { router } from 'expo-router'
import { useAuth } from '../features/auth/useAuth'
import { getOauthRedirectUrl } from '../features/auth/getOauthRedirectUrl'
import { setClientConfig } from '../shared/api/client'
// @ts-ignore
import { EXPO_PUBLIC_API_BASE_URL, EXPO_PUBLIC_API_KEY } from '@env'
import * as SecureStore from 'expo-secure-store'
import { tokenKeys } from '../features/auth/types/auth-api.types'

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  const { login } = useAuth()

  setClientConfig({
    baseURL: EXPO_PUBLIC_API_BASE_URL,
    apiKey: EXPO_PUBLIC_API_KEY,

    getAccessToken: () => SecureStore.getItemAsync(tokenKeys.accessToken),
    saveAccessToken: (token) =>
      token
        ? SecureStore.setItemAsync(tokenKeys.accessToken, token)
        : SecureStore.deleteItemAsync(tokenKeys.accessToken),
    getRefreshToken: () => SecureStore.getItemAsync(tokenKeys.refreshToken),
    saveRefreshToken: (token) =>
      token
        ? SecureStore.setItemAsync(tokenKeys.refreshToken, token)
        : SecureStore.deleteItemAsync(tokenKeys.refreshToken),
  })

  const handleLogin = async () => {
    // Спробуємо різні варіанти redirect URI
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'musicfun',
      path: 'oauth/callback',
    })

    const authUrl = getOauthRedirectUrl(redirectUri)

    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri)

      const { type, url } = result as { type: string; url?: string }

      console.log('Auth result:', url)
      console.log('type', type)

      if (type === 'success' && url) {
        const code = new URL(url).searchParams.get('code')

        if (code) {
          console.log('---code', code)
          // await login(code, redirectUri);
          router.replace('/tracks')
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  // const handleReplace = () => {
  //   router.replace("/tracks");
  // };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleLogin}
        style={{
          padding: 12,
          backgroundColor: 'black',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Login</Text>
      </Pressable>
      {/* <Pressable
        onPress={handleReplace}
        style={{
          padding: 12,
          backgroundColor: "black",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Replace</Text>
      </Pressable> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
