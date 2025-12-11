import '../shared/api/api-root/api-root'

import { useFonts } from 'expo-font'
import { Redirect, SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthContextProvider } from '@/features/auth/model/context/AuthContext'
import { ReactQueryProvider } from '@/shared/providers/reactQueryProviders/ReactQueryProviders'
import { COLORS } from '@/shared/styles/tokens'

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <ReactQueryProvider>
      <AuthContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar hidden={false} style="light" />
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: COLORS.DARK.BACKGROUND_MAIN },
                headerTintColor: COLORS.DARK.BUTTON_MAIN_PINK_HOVER,
              }}>
              <Stack.Screen name="(app)" options={{ autoHideHomeIndicator: false }} />
              <Stack.Screen name="(auth)" options={{ autoHideHomeIndicator: false }} />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthContextProvider>
    </ReactQueryProvider>
  )
}
