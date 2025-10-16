import { View, StyleSheet, Text } from 'react-native'
import { Button } from '@/shared/ui/Button/Button'
import { SafeAreaView } from 'react-native-safe-area-context'

import { COLORS, GAPS } from '@/shared/styles/tokens'
import * as WebBrowser from 'expo-web-browser'

import { LoginButton } from '@/features/auth/components/LoginButton/LoginButton'
import { useAuthContext } from '@/features/auth/model/context/AuthContext'
import { useEffect } from 'react'
import { router } from 'expo-router'
import { IcSmile } from '@/shared/ui/Icons/screens/login/IcSmile'

export default function Login() {
  const { isAuth } = useAuthContext()

  const onPressSignUp = async () => {
    await WebBrowser.openBrowserAsync('https://github.com/signup')
  }
  //
  useEffect(() => {
    if (isAuth) router.replace('/playlists/playlists')
  }, [isAuth])

  // const query = useQuery({
  //   staleTime: 5 * 1000, // 10 seconds когда данные устарели, сделай снова запрос
  //   // gcTime: 5 * 1000, // 5 seconds сколько хранить данные в кэше
  //   refetchOnMount: true, //когда монтируется компонент, сделай запрос (выключено)
  //   refetchOnWindowFocus: true, //когда фокус на окне, сделай запрос (выключено)
  //   refetchOnReconnect: false, //когда мы были офлайн, но стали онлайн
  //   queryKey: ['playlists'],
  //   queryFn: async ({ signal }) => {
  //     const response = await AuthPlaylistInstance.getPlaylist()
  //     return response?.data
  //   },
  // })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexContainer}>
        <View></View>
        <View>
          <View style={styles.smileContainer}>
            <IcSmile />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Millions of Songs.{'\n'}
              Free on Musifun.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <LoginButton />
            <Button variant={'gray'} isFull onPress={onPressSignUp} title="Continue without Sign In" />
          </View>
        </View>
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
    alignItems: 'stretch',
  },
  smileContainer: {
    marginBottom: 19,
    width: '100%',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 26,
    paddingHorizontal: 30,
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    // lineHeight: 10,
    letterSpacing: 0,
    fontWeight: 700,
    textAlign: 'center',
    color: COLORS.DARK.TEXT_MAIN_WHITE,
  },
  flexContainer: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-around',
    width: '100%',
  },
})
