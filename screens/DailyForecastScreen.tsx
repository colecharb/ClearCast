import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, FlatList, KeyboardAvoidingView, Platform, RefreshControl, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { WeatherContext } from '../contexts/Weather';
import { refreshDelay } from '../utils/wait';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import makeStyles from '../constants/Styles';
import Layout from '../constants/Layout';

import DayForecastCard from '../components/DayForecastCard';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

export default function ({ navigation }: RootTabScreenProps<'DailyTab'>) {

  const theme = useColorScheme()
  const headerHeight = useHeaderHeight()
  const tabBarHeight = useBottomTabBarHeight()
  const styles = makeStyles()

  // Contexts
  const weather = useContext(WeatherContext);
  const forecast = weather.dailyForecast;

  // States
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('');


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



  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>)

  return (

    <ScreenContainer >

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-tabBarHeight}
        style={{ flex: 1 }}
      >



        <FlatList
          contentContainerStyle={[styles.container, { flex: 1, paddingTop: headerHeight }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
          data={forecast?.list}
          renderItem={({ item, index, separators }) => <DayForecastCard forecast={forecast} index={index} />}
          ItemSeparatorComponent={() => <View style={{ height: Layout.margin }} />}
        />


        {/* <View style={{ zIndex: Layout.gradientOverlayZIndex + 1, position: 'relative', bottom: 0, backgroundColor: 'transparent' }}> */}
        <LinearGradient
          colors={[Colors[theme].background + '00', Colors[theme].background + '99', Colors[theme].background]}
          style={{ zIndex: 11, marginTop: -3 * tabBarHeight, paddingVertical: tabBarHeight }}
        >
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Current Location"
          />
        </LinearGradient>


        {/* </View> */}


      </KeyboardAvoidingView>

    </ScreenContainer >

  );
}
