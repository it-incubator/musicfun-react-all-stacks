import { COLORS } from '@/shared/styles/tokens'
import { IcAllPlaylist } from '@/shared/ui/Icons/navigation/IcAllPlaylist'
import { IcAllTracks } from '@/shared/ui/Icons/navigation/IcAllTracks'
import { IcHome } from '@/shared/ui/Icons/navigation/IcHome'
import { IcYourLibrary } from '@/shared/ui/Icons/navigation/IcYourLibrary'
import { useFonts } from 'expo-font'
import { useRootNavigationState, useRouter, SplashScreen, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function AppLayout() {
  const router = useRouter()
  const rootState = useRootNavigationState()

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            headerShadowVisible: false,
            headerStyle: {
              // shadowColor: 'transparent'
            },
            tabBarStyle: {
              backgroundColor: COLORS.DARK.BACKGROUND_MAIN,
              borderTopColor: 'transparent',
            },
            tabBarActiveTintColor: 'white',

            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: () => <IcHome />,
            }}
          />
          <Tabs.Screen
            name="playlists"
            options={{
              title: 'Playlists',
              tabBarIcon: () => <IcAllPlaylist />,
            }}
          />
          <Tabs.Screen name="tracks" options={{ title: 'Tracks', tabBarIcon: () => <IcAllTracks /> }} />
          <Tabs.Screen
            name="library"
            options={{
              title: 'Library',
              tabBarIcon: () => <IcYourLibrary />,
            }}
          />
        </Tabs>

        {!rootState?.key && (
          <View style={styles.overlay}>
            <ActivityIndicator />
          </View>
        )}
      </GestureHandlerRootView>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: COLORS.DARK.BACKGROUND_MAIN,
    opacity: 0.7,
  },
})
