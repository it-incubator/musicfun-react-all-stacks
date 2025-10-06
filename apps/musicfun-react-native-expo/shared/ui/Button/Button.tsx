import { COLORS, FONTS_SIZES, RADIUS } from '@/shared/styles/tokens'
import { ButtonProps } from '@/shared/ui/Button/Button.type'
import React from 'react'
import { Pressable, Text, StyleSheet, Animated, GestureResponderEvent, ActivityIndicator } from 'react-native'

export const Button = ({
  title,
  buttonStyle,
  textStyle,
  onPressIn,
  onPressOut,
  isLoading,
  isFull,
  variant = 'primary',
  disabled,
  ...props
}: ButtonProps) => {
  const bg = React.useRef(new Animated.Value(0)).current
  const scale = React.useRef(new Animated.Value(1)).current

  const [fromColor, toColor] =
    variant === 'gray'
      ? [COLORS.DARK.BUTTON_MAIN_GRAY, COLORS.DARK.BUTTON_MAIN_GRAY_HOVER ?? COLORS.DARK.BUTTON_MAIN_GRAY]
      : [COLORS.DARK.BUTTON_MAIN_PINK, COLORS.DARK.BUTTON_MAIN_PINK_HOVER ?? COLORS.DARK.BUTTON_MAIN_PINK]

  const bgColor = bg.interpolate({ inputRange: [0, 1], outputRange: [fromColor, toColor] })

  const handlePressIn = (e: GestureResponderEvent) => {
    if (disabled) return
    Animated.timing(bg, { toValue: 1, duration: 100, useNativeDriver: false }).start()
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()
    onPressIn?.(e)
  }

  const handlePressOut = (e: GestureResponderEvent) => {
    if (disabled) return
    Animated.timing(bg, { toValue: 0, duration: 100, useNativeDriver: false }).start()
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start()
    onPressOut?.(e)
  }

  const width = isFull ? '100%' : 328
  const height = 51

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={[{ width }, buttonStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.shell, { width, height, transform: [{ scale }] }]}>
        <Animated.View style={[styles.fill, { backgroundColor: bgColor, opacity: disabled ? 0.6 : 1 }]} />
        {!isLoading && <Text style={[styles.text, textStyle]}>{title}</Text>}
        {isLoading && <ActivityIndicator size="small" color={COLORS.DARK.TEXT_MAIN_WHITE} />}
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.R45,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.R45,
  },
  text: {
    fontSize: FONTS_SIZES.f16,
    color: COLORS.DARK.TEXT_MAIN_WHITE,
    fontFamily: 'Lato-Bold',
  },
})
