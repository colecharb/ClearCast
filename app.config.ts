import 'dotenv/config'

export default {
  "expo": {
    "owner": "clearcast",
    "name": "ClearCast",
    "slug": "ClearCast",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "clearcast",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000",
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
    }
  }
}
