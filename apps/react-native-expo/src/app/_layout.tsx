import { Stack } from 'expo-router'
import { AuthProvider } from '../features/auth/AuthContext'
import QueryProvider from '../shared/api/QueryProvider'

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        {/* Empty <Stack /> lets expo-router auto-register all screens */}
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryProvider>
  )
}
