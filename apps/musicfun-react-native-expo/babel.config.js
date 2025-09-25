module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',

      [
        'module-resolver',
        {
          root: ['.'],
          alias: { '@': './' },
          extensions: ['.tsx', '.ts', '.js', '.json'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
