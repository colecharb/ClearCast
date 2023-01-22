import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, FlatList, KeyboardAvoidingView, Platform, RefreshControl, ScrollView } from 'react-native';
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
import Layout from '../constants/Layout';
import HourForecastCard from '../components/HourForecastCard';
import DayForecastCard from '../components/DayForecastCard';

export default function ({ navigation }: RootTabScreenProps<'DailyTab'>) {

  // const theme = useColorScheme()
  const headerHeight = useHeaderHeight()
  const styles = makeStyles()

  // Contexts
  const weather = useContext(WeatherContext);
  const forecast = weather.dailyForecast;

  // States
  const [refreshing, setRefreshing] = useState(false)
  // const [searchQuery, setSearchQuery] = useState<string>('');


  useEffect(() => {
    weather.getDailyForecastAsync()
  }, [])

  const reload = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refreshDelay(),
      weather.getDailyForecastAsync()
      // refetch things
    ]).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const city = forecast?.city
    // const country = forecast?.city.country
    if (city) {
      navigation.setOptions({ title: `Daily: ${city.name}` })
    }
  }, [forecast?.city])

  // renderCount.current += 1;

  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>)

  return (

    <ScreenContainer >

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={useHeaderHeight()}
        style={{ flex: 1 }}
      >
        <FlatList
          contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
          data={forecast?.list}
          renderItem={({ item, index, separators }) => <DayForecastCard forecast={forecast} index={index} />}
          ItemSeparatorComponent={() => <View style={{ height: Layout.margin }} />}
        />


        {/* <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Current Location"
        /> */}

      </KeyboardAvoidingView >

    </ScreenContainer >

  );
}
