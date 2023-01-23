import React, { useCallback, useContext, useEffect } from 'react';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
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
import HourForecastCard from '../components/HourForecastCard';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

export default function ({ navigation }: RootTabScreenProps<'HourlyTab'>) {

  const theme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = makeStyles();

  // Contexts
  const weather = useContext(WeatherContext);
  const forecast = weather.hourlyForecast;

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchBarBottom, setSearchBarBottom] = useState<number>(tabBarHeight)


  useEffect(() => {
    weather.getHourlyForecastAsync();
  }, [])

  const reload = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refreshDelay(),
      weather.getHourlyForecastAsync()
      // refetch things
    ]).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const city = forecast?.city
    // const country = forecast?.city.country
    if (city) {
      navigation.setOptions({ title: `Hourly: ${city.name}` })
    }
  }, [forecast?.city])

  // renderCount.current += 1;

  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>)

  return (

    <ScreenContainer >

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-tabBarHeight}
        style={{ flex: 1 }}
      >
        {/* <GradientOverlay /> */}

        <FlatList
          contentContainerStyle={[styles.container, {}]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
          data={forecast?.list}
          renderItem={({ item, index, separators }) => <HourForecastCard forecast={forecast} index={index} />}
          ItemSeparatorComponent={() => <View style={{ height: Layout.margin }} />}
        />

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




      </KeyboardAvoidingView >

    </ScreenContainer >

  );
}
