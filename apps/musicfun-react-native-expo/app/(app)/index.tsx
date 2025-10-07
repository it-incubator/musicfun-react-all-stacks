import { COLORS, GAPS } from '@/shared/styles/tokens'

import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LogoutButton } from '@/features/auth/components/LogoutButton/LogoutButton'

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <LogoutButton />
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
