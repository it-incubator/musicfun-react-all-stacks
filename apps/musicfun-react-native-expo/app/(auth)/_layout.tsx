import { Stack } from 'expo-router'
import { COLORS } from '@/shared/styles/tokens'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: COLORS.DARK.BUTTON_MAIN_PINK_HOVER,
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  )
}
