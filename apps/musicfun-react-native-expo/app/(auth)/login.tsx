import { View, StyleSheet } from 'react-native'
import { Button } from '@/shared/ui/Button/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuthContext } from '@/features/auth/model/context/AuthContext'

export default function Login() {
  const router = useRouter()
  const { login } = useAuthContext()
  console.log('router', router)
  const onPressLogin = () => {
    login('MOCK_CODE', 'MOCK_REDIRECT')
    router.replace('/')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={onPressLogin} title="Login" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
