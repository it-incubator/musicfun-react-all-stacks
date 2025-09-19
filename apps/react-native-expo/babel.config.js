module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Плагін Router-а має бути ПЕРШИМ
      'expo-router/babel',

      // далі — react-native-dotenv
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowUndefined: true,
        },
      ],
    ],
  }
}
