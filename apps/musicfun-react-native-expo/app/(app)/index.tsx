import { COLORS, GAPS } from '@/shared/styles/tokens'

import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LogoutButton } from '@/features/auth/components/LogoutButton/LogoutButton'
import { useMeQuery } from '@/features/auth/model/api/hooks/use-me.query'

export default function Home() {
  const { data, isPending } = useMeQuery()
  return (
    <SafeAreaView style={styles.container}>
      {data && <Text style={{ color: 'white' }}>{data.login}</Text>}

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
