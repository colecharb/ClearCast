import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS, SettingsData, defaultSettings } from '../contexts/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [storedSettings, setStoredSettings] = useState({} as SettingsData)

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (error) {
        // We might want to provide this error information to an error reporting service
        console.warn("ERROR loading fonts with loadResourcesAndDataAsync()."), error;
      }
    }

    async function loadStoredSettingsAsync(): Promise<void> {
      try {

        const settingsSerialized = await AsyncStorage.getItem(
          STORAGE_KEYS.SETTINGS
        ).catch((error) => { });

        const settings: SettingsData = (() => {
          if (!settingsSerialized) {
            console.log('No settings found in local storage; Using default settings.');
            return defaultSettings;
          }

          console.log('Loaded serialized settings from local storage.');
          return JSON.parse(settingsSerialized) as SettingsData;

        })();

        console.log('settings =', JSON.stringify(settings));
        setStoredSettings(settings)

      } catch (error) {
        console.log("ERROR inside loadStoredSettingsAsync().", error)
      } finally {
        //loading finished
      }
    }

    // call above loading functions only before first render
    SplashScreen.preventAutoHideAsync();
    Promise.all([
      loadResourcesAndDataAsync(),
      loadStoredSettingsAsync(),
    ]).finally(() => {
      setLoadingComplete(true);
      SplashScreen.hideAsync();
    });
  }, []);

  return { isLoadingComplete, storedSettings };
}
