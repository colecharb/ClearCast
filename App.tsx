import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './contexts/Settings';
import { WeatherProvider } from './contexts/Weather';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const { isLoadingComplete, storedSettings } = useCachedResources();
  const theme = useColorScheme();

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SettingsProvider storedSettings={storedSettings}>
        <WeatherProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={theme} />
            <StatusBar style='light' />
          </SafeAreaProvider>
        </WeatherProvider>
      </SettingsProvider>
    );
  }
}
