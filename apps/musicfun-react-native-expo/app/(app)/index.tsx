import { COLORS, GAPS } from '@/shared/styles/tokens'
import { Button } from '@/shared/ui/Button/Button'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Button title={'Button'} />
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
