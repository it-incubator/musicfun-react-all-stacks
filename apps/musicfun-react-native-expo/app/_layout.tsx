import { COLORS } from '@/shared/styles/tokens'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../shared/api/api-root/api-root'
import { ReactQueryProvider } from '@/shared/providers/reactQueryProviders/ReactQueryProviders'
import { GestureHandlerRootView } from 'react-native-gesture-handler' // триггер для просмотра  работы  .env

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
    'Lato-Thin': require('../assets/fonts/Lato-Thin.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <>
      <ReactQueryProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar hidden={false} style="light" />
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: COLORS.DARK.BACKGROUND_MAIN },
                headerTintColor: COLORS.DARK.BUTTON_MAIN_PINK_HOVER,
              }}
            >
              <Stack.Screen name="(app)" options={{ autoHideHomeIndicator: false }} />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ReactQueryProvider>
    </>
  )
}
