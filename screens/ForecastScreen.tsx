import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, RefreshControl, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { WeatherContext } from '../contexts/Weather';
import wait, { refreshDelay, waitTime } from '../utils/wait';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import makeStyles from '../constants/Styles';

export default function ({ navigation }: RootTabScreenProps<'TabOne'>) {

  const theme = useColorScheme()

  const styles = makeStyles()

  // Constants
  const API_KEY = 'f82f1ad0af0d696e1c657915946d75c2'
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${57}&lon=${-2.15}&appid=${API_KEY}&units=imperial`

  // Contexts
  const weatherContext = useContext(WeatherContext);
  // const location = weatherContext.location;
  const weatherData = weatherContext.currentWeather;

  // States
  const [refreshing, setRefreshing] = useState(false)
  // const [searchQuery, setSearchQuery] = useState<string>('');

  // Refs
  // const renderCount = useRef<number>(0);
  // const apiCallCount = useRef<number>(0);


  useEffect(() => {
    weatherContext.getCurrentWeatherAsync()
  }, [])

  const reload = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refreshDelay(),
      weatherContext.getCurrentWeatherAsync()
      // refetch things
    ]).then(() => setRefreshing(false));
  }, []);

  // renderCount.current += 1;

  if (weatherContext.errorMessage) return (<Text>{weatherContext.errorMessage}</Text>)

  return (

    <ScreenContainer >

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={useHeaderHeight()}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={reload}
          />}
        >

          <View style={[styles.card, styles.container]}>
            <Text>{weatherData?.name}</Text>
            <Text>{weatherData?.weather[0].main}</Text>
            <Text>{weatherData?.main.temp}˚F  (feels like {weatherData?.main.feels_like})</Text>
          </View>

          {/* <View style={{ flex: 1, alignItems: 'center' }}> */}

          {/* <Text>
            {renderCount.current} renders
            {'\n'}
            {apiCallCount.current} calls to API
            {'\n'}
          </Text> */}

          {/* <Text style={{ textAlign: 'center' }}>
            Daily forecasts (past, present, and future) will be displayed here.
          </Text> */}

          {/* <Text style={{ fontFamily: 'space-mono' }}>
            LOCATION: {JSON.stringify(location.current, null, '  ') + '\n'}
          </Text>

          <Text style={{ fontFamily: 'space-mono' }}>
            CURRENT WEATHER: {JSON.stringify(weatherContext.currentWeather.current, null, '  ')}
          </Text> */}





          {/* </View> */}

        </ScrollView>

        {/* <Button
          title='REFRESH (getCurrentWeatherAsync)'
          onPress={reload}
        /> */}



        {/* <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Current Location"
        /> */}

      </KeyboardAvoidingView >

    </ScreenContainer >

  );
}
