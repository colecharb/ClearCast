import 'dotenv/config'
export default {
  "expo": {
    "owner": "clearcast",
    "name": "ClearCast",
    "slug": "ClearCast",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "com.clearcast.ClearCast",
      "supportsTablet": true
    },
    "android": {
      "package": "com.clearcast.ClearCast",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "extra": {
      "owmApiKey": process.env.OWM_API_KEY,
      "eas": {
        "projectId": "74f6f17f-7821-4e6d-abb4-f88f456b6997"
      }
    }
  },
  "react-native-google-mobile-ads": {
    "andriod-app-id": "ca-app-pub-7430206445028643~4211580278",
    "ios-app-id": "ca-app-pub-7430206445028643~7723449871"
  }
}
