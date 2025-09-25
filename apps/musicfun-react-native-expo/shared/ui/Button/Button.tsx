import { COLORS, FONTS_SIZES, RADIUS } from '@/shared/styles/tokens'
import { ButtonProps } from '@/shared/ui/Button/Button.type'
import React, { useRef } from 'react'
import {
  Pressable,
  PressableProps,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
  Animated,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native'

export const Button = ({ title, buttonStyle, textStyle, onPressIn, onPressOut, isLoading, ...props }: ButtonProps) => {
  const animatedValue = new Animated.Value(100)
  const color = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [COLORS.DARK.BUTTON_MAIN_PINK, COLORS.DARK.BUTTON_MAIN_PINK_HOVER ?? COLORS.DARK.BUTTON_MAIN_PINK],
  })
  const scale = useRef(new Animated.Value(1)).current

  const handlePressIn = (e: GestureResponderEvent) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start()

    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
    onPressIn?.(e)
  }
  const handlePressOut = (e: GestureResponderEvent) => {
    Animated.timing(animatedValue, {
      toValue: 100,
      duration: 100,
      useNativeDriver: true,
    }).start()

    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
    onPressOut?.(e)
  }

  return (
    <Pressable {...props} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: color,
            transform: [{ scale }],
          },
          buttonStyle,
        ]}
      >
        {!isLoading && <Text style={[styles.text, textStyle]}>{title}</Text>}
        {isLoading && <ActivityIndicator size={'small'} color={COLORS.DARK.TEXT_MAIN_WHITE} />}
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.R45,
    width: 328,
    height: 45,
    backgroundColor: COLORS.DARK.BUTTON_MAIN_PINK,
  },
  text: {
    fontSize: FONTS_SIZES.f16,
    color: COLORS.DARK.TEXT_MAIN_WHITE,
    fontFamily: 'Lato-Regular',
  },
})
