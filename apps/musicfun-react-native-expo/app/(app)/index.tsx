import { COLORS, GAPS } from '@/shared/styles/tokens'
import { Button } from '@/shared/ui/Button/Button'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useAuthContext } from '@/features/auth/model/api/context/AuthContext'

export default function Home() {
  const { logout } = useAuthContext()

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={logout} title={'Logout'} />
      <Button title={'Button'} />
      <Button title={'Button'} />
      <Button title={'Button'} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK.BACKGROUND_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    gap: GAPS.G8,
  },
})
