import { COLORS } from '@/shared/styles/tokens'
import { IcAllPlaylist } from '@/shared/ui/Icons/navigation/IcAllPlaylist'
import { IcAllTracks } from '@/shared/ui/Icons/navigation/IcAllTracks'
import { IcHome } from '@/shared/ui/Icons/navigation/IcHome'
import { IcYourLibrary } from '@/shared/ui/Icons/navigation/IcYourLibrary'
import { useRootNavigationState, useRouter, SplashScreen, Tabs, Redirect } from 'expo-router'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useAuthContext } from '@/features/auth/model/context/AuthContext'
import { useMeQuery } from '@/features/auth/model/api/hooks/use-me.query'

export default function AppLayout() {
  const rootState = useRootNavigationState()
  const { isAuth } = useAuthContext()

  if (!isAuth) return <Redirect href="/(auth)/login" />

  return (
    <>
      <Tabs
        initialRouteName={'index'}
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
          name="playlists/playlists"
          options={{
            title: 'Playlists',
            tabBarIcon: () => <IcAllPlaylist />,
          }}
        />
        <Tabs.Screen name="tracks/tracks" options={{ title: 'Tracks', tabBarIcon: () => <IcAllTracks /> }} />
        <Tabs.Screen
          name="library/library"
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
