import * as dotenv from 'dotenv'

const PROFILE =
  process.env.EAS_BUILD_PROFILE ??
  process.env.APP_ENV ??
  (process.env.NODE_ENV === 'production' ? 'production' : 'development')

dotenv.config({ path: `.env.${PROFILE}` })

export default ({ config }: any) => ({
  ...config,
  expo: {
    name: 'musicfun-react-native-expo',
    slug: 'musicfun-react-native-expo',
    scheme: 'musicfun',
    version: '1.0.0',
    orientation: 'portrait',

    icon: '',
    splash: {
      image: '',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },

    androidStatusBar: {
      translucent: true,
      backgroundColor: 'transparent',
      barStyle: 'light-content',
    },
    iosStatusBar: {
      translucent: true,
      backgroundColor: 'transparent',
      barStyle: 'light-content',
    },
    androidNavigationBar: {
      backgroundColor: 'transparent',
      barStyle: 'light-content',
    },

    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.your.bundle',
    },
    android: {
      package: 'com.your.package',
    },

    extra: {
      env: PROFILE,
      API_BASE_URL: process.env.API_BASE_URL ?? '',
      API_API_KEY: process.env.API_API_KEY ?? '',
    },
  },
})
