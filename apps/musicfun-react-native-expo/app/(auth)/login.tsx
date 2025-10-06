import { View, StyleSheet } from 'react-native'
import { Button } from '@/shared/ui/Button/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuthContext } from '@/features/auth/model/context/AuthContext'
import { COLORS, GAPS } from '@/shared/styles/tokens'
import * as WebBrowser from 'expo-web-browser'
import { useLoginMutation } from '@/features/auth/model/api/hooks/use-login-mutatuion'
import { LoginButton } from '@/features/auth/components/LoginButton/LoginButton'
import { useQuery } from '@tanstack/react-query'
import AuthPlaylistInstance from '@/features/playlists/model/api/playlist-instance/playlist-instance'

export default function Login() {
  const router = useRouter()
  const { login } = useAuthContext()

  const { mutateAsync: loginMutation } = useLoginMutation()

  const onPressLogin = () => {
    login('MOCK_CODE', 'MOCK_REDIRECT')
    router.replace('/')
  }

  const onPressSignUp = async () => {
    await WebBrowser.openBrowserAsync('https://github.com/signup')
  }

  const query = useQuery({
    staleTime: 5 * 1000, // 10 seconds когда данные устарели, сделай снова запрос
    // gcTime: 5 * 1000, // 5 seconds сколько хранить данные в кэше
    refetchOnMount: true, //когда монтируется компонент, сделай запрос (выключено)
    refetchOnWindowFocus: true, //когда фокус на окне, сделай запрос (выключено)
    refetchOnReconnect: false, //когда мы были офлайн, но стали онлайн
    queryKey: ['playlists'],
    queryFn: async ({ signal }) => {
      const response = await AuthPlaylistInstance.getPlaylist()
      return response?.data
    },
  })

  const { data, status, fetchStatus, isFetching, isPending } = query

  console.log(data, 'data')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <LoginButton />
        <Button variant={'gray'} isFull onPress={onPressSignUp} title="Continue without Sign In" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.DARK.BACKGROUND_MAIN,
  },
  buttonContainer: {
    gap: GAPS.G27,
    width: '100%',
  },
})
